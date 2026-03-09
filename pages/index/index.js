Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],
    weightRecords: [], // 体重记录数组
    currentKnowledge: '', // 当前显示的小知识
    lastKnowledgeIndex: -1, // 上一次显示的知识索引
    // 日历打卡相关
    calendarYear: 0,
    calendarMonth: 0,
    calendarDays: [],
    showCheckinModal: false,
    checkinDate: '',
    checkinData: {
      waterCount: '',
      trainMinutes: '',
      dietRecord: ''
    },
  },

  // 减脂与增肌小知识库
  knowledgeList: [
    '每公斤脂肪约含7700千卡热量，每天少吃500千卡约两周减1公斤。',
    '蛋白质是肌肉修复的基础，建议每公斤体重摄入1.5–2g蛋白质。',
    '力量训练能提高基础代谢，让你在休息时也能燃烧更多热量。',
    '减脂不等于减重，保留肌肉、减少脂肪才是健康减脂的核心。',
    '睡眠不足会升高皮质醇，导致脂肪囤积，建议每晚睡7–8小时。',
    '有氧运动燃脂效率高，但过量有氧会消耗肌肉，需配合力量训练。',
    '饮食中的脂肪不是敌人，适量健康脂肪有助于激素分泌和营养吸收。',
    '复合动作（深蹲、硬拉、卧推）比孤立动作更高效，燃脂增肌两不误。',
    '吃太少反而会降低代谢，科学减脂应保持合理热量缺口，而非节食。',
    '训练后30分钟内补充蛋白质和碳水，能显著促进肌肉合成与恢复。',
    '多喝水能促进新陈代谢，建议每天饮水量为体重(kg)×30ml。',
    '减脂期碳水不宜完全断绝，低碳会导致代谢下降和训练表现变差。',
    '肌肉增长需要热量盈余，增肌期建议每天多吃300–500千卡热量。',
    '每周训练3–5次，每次45–60分钟，是大多数人的最佳训练频率。',
    '高蛋白饮食能增强饱腹感，减少总热量摄入，有助于减脂。',
    '训练前适当补充碳水能提升运动表现，空腹训练并不一定更燃脂。',
    '减脂平台期很正常，可通过调整训练计划或饮食结构来突破。',
    '肌肉密度是脂肪的3倍，同体重下肌肉多的人看起来更瘦。',
    '每餐都应包含蛋白质、碳水和健康脂肪，均衡饮食是关键。',
    '拉伸和放松能减少训练后酸痛，加速肌肉恢复，别忽略训练后拉伸。',
    '快速减重大多减的是水分和肌肉，缓慢减脂才能长久保持。',
    '增肌期也要控制脂肪摄入，否则容易增加过多体脂。',
    '每周称重1–2次即可，每天称重波动大，容易影响心态。',
    '健康减脂速度建议每周减0.5–1公斤，过快会损失肌肉。',
    '组间休息60–90秒适合增肌，30–60秒适合燃脂训练。',
    '不要害怕举铁，女性力量训练不会变“金刚芭比”，只会更紧致。',
    '蛋白质来源多样化：鸡胸、鱼、蛋、豆制品都是优质选择。',
    '吃饭速度放慢，细嚼慢咽能让大脑及时接收饱腹信号，减少过量进食。',
    'HIIT训练能在短时间内燃烧大量热量，且训练后仍持续燃脂。',
    '压力大会导致皮质醇升高，促进脂肪囤积，学会管理压力很重要。',
    '训练日和休息日的饮食可适当调整，训练日多吃碳水，休息日稍减。',
  ],

  onLoad() {
    // 页面加载时加载体重记录
    this.loadWeightRecords();
    // 初始化小知识
    this.refreshKnowledge();
    // 每30秒自动刷新小知识
    this.knowledgeTimer = setInterval(() => {
      this.refreshKnowledge();
    }, 30000);
    // 初始化日历
    this.initCalendar();
  },

  onShow() {
    // 页面显示时刷新体重记录
    this.loadWeightRecords();
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.knowledgeTimer) {
      clearInterval(this.knowledgeTimer);
      this.knowledgeTimer = null;
    }
  },

  // ==================== 减脂与增肌小知识 ====================
  refreshKnowledge() {
    const list = this.knowledgeList;
    let index;
    do {
      index = Math.floor(Math.random() * list.length);
    } while (index === this.data.lastKnowledgeIndex && list.length > 1);
    this.setData({
      currentKnowledge: list[index],
      lastKnowledgeIndex: index
    });
  },

  // ==================== 体重记录管理 ====================
  loadWeightRecords() {
    // 从本地存储加载体重记录
    wx.getStorage({
      key: 'weightRecords',
      success: (res) => {
        const records = res.data || [];
        // 只保留最近7天的记录
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const filteredRecords = records.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= sevenDaysAgo;
        });
        this.setData({ weightRecords: filteredRecords });
      },
      fail: () => {
        this.setData({ weightRecords: [] });
      }
    });
  },

  recordWeight() {
    const currentWeight = this.data.predictionData?.initialWeight;
    if (!currentWeight) {
      wx.showToast({
        title: '请先输入当前体重',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    // 获取当前时间
    const now = new Date();
    const timestamp = now.getTime();
    const dateStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 获取现有记录
    wx.getStorage({
      key: 'weightRecords',
      success: (res) => {
        let records = res.data || [];
        records.push({
          weight: currentWeight,
          timestamp: timestamp,
          dateStr: dateStr
        });
        // 只保留最近7天的记录
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        records = records.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= sevenDaysAgo;
        });
        // 保存到本地存储
        wx.setStorage({
          key: 'weightRecords',
          data: records,
          success: () => {
            this.setData({ weightRecords: records });
            wx.showToast({
              title: '体重已记录',
              icon: 'success',
              duration: 1500
            });
          }
        });
      },
      fail: () => {
        // 如果没有记录过，创建新的
        const records = [{
          weight: currentWeight,
          timestamp: timestamp,
          dateStr: dateStr
        }];
        wx.setStorage({
          key: 'weightRecords',
          data: records,
          success: () => {
            this.setData({ weightRecords: records });
            wx.showToast({
              title: '体重已记录',
              icon: 'success',
              duration: 1500
            });
          }
        });
      }
    });
  },

  // ==================== Tab切换 ====================
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  // ==================== 热量计算页 - 性别选择 ====================
  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ 'calorieData.gender': gender });
    this.calculateBMR();
  },

  // ==================== 热量计算页 - 年龄输入 ====================
  onAgeInput(e) {
    const age = e.detail.value;
    this.setData({ 'calorieData.age': age });
    this.calculateBMR();
    this.calculateBMI();
  },

  // ==================== 热量计算页 - 身高输入 ====================
  onHeightInput(e) {
    const height = e.detail.value;
    this.setData({ 'calorieData.height': height });
    this.calculateBMR();
    this.calculateBMI();
  },

  // ==================== 热量计算页 - 体重输入 ====================
  onWeightInput(e) {
    const weight = e.detail.value;
    this.setData({ 'calorieData.weight': weight });
    this.calculateBMR();
    this.calculateBMI();
    this.calculateNutrition();
  },

  // ==================== 热量计算页 - 有氧训练时间输入 ====================
  onCardioMinutesInput(e) {
    const value = e.detail.value.replace(/[^0-9]/g, '');
    this.setData({ 'calorieData.cardioMinutes': value });
    this.calculateTrainCalories();
  },

  // ==================== 热量计算页 - 无氧训练时间输入 ====================
  onStrengthMinutesInput(e) {
    const value = e.detail.value.replace(/[^0-9]/g, '');
    this.setData({ 'calorieData.strengthMinutes': value });
    this.calculateTrainCalories();
  },

  // ==================== 热量计算页 - 营养模式选择 ====================
  onNutritionModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 'calorieData.nutritionMode': mode });
    this.calculateNutrition();
  },

  // ==================== 热量计算页 - 自定义营养输入 ====================
  onCustomCarbsInput(e) {
    const carbs = e.detail.value;
    this.setData({ 'calorieData.customNutrition.carbs': carbs });
    this.calculateNutrition();
  },

  onCustomProteinInput(e) {
    const protein = e.detail.value;
    this.setData({ 'calorieData.customNutrition.protein': protein });
    this.calculateNutrition();
  },

  onCustomFatInput(e) {
    const fat = e.detail.value;
    this.setData({ 'calorieData.customNutrition.fat': fat });
    this.calculateNutrition();
  },

  // ==================== 减脂预测页 - 初始体重输入 ====================
  onInitialWeightInput(e) {
    const initialWeight = e.detail.value;
    this.setData({ 'predictionData.initialWeight': initialWeight });
    this.calculatePrediction();
  },

  // ==================== 减脂预测页 - 目标体重输入 ====================
  onTargetWeightInput(e) {
    const targetWeight = e.detail.value;
    this.setData({ 'predictionData.targetWeight': targetWeight });
    this.calculatePrediction();
  },

  // ==================== 减脂预测页 - 百分比增减 ====================
  decreasePercent() {
    let percent = parseInt(this.data.predictionData?.monthlyLossPercent) || 0;
    if (percent > 1) {
      percent--;
      this.setData({ 'predictionData.monthlyLossPercent': percent });
      this.calculatePrediction();
    }
  },

  increasePercent() {
    let percent = parseInt(this.data.predictionData?.monthlyLossPercent) || 0;
    if (percent < 5) {
      percent++;
      this.setData({ 'predictionData.monthlyLossPercent': percent });
      this.calculatePrediction();
    }
  },

  // ==================== 计算函数 ====================

  // 计算BMR（基础代谢率）
  calculateBMR() {
    const calorieData = this.data.calorieData || {};
    const { gender, age, height, weight } = calorieData;
    
    if (!gender || !age || !height || !weight) {
      this.setData({ 'calorieData.bmr': '' });
      return;
    }

    const app = getApp();
    const bmr = app.calculateBMR(gender, age, height, weight);
    
    this.setData({ 'calorieData.bmr': bmr || '' });
    this.calculateTDEE();
  },

  // 计算TDEE（每日总热量消耗）
  calculateTDEE() {
    const calorieData = this.data.calorieData || {};
    const { bmr, trainCalories } = calorieData;
    
    if (!bmr) {
      this.setData({ 'calorieData.tdee': '' });
      return;
    }

    const bmrNum = parseFloat(bmr) || 0;
    const trainCaloriesNum = parseFloat(trainCalories) || 0;
    const tdee = Math.round(bmrNum + trainCaloriesNum);
    
    this.setData({ 'calorieData.tdee': tdee || '' });
    this.calculateNutrition(); // TDEE更新后重新计算营养
  },

  // 计算有氧消耗热量（中等强度有氧，约8千卡/分钟）
  calculateCardioCalories(minutes) {
    return Math.round(minutes * 8);
  },

  // 计算无氧消耗热量（中等强度力量训练，约6千卡/分钟）
  calculateStrengthCalories(minutes) {
    return Math.round(minutes * 6);
  },

  // 计算训练消耗热量（有氧 + 无氧）
  calculateTrainCalories() {
    const calorieData = this.data.calorieData || {};
    const cardioMin = parseInt(calorieData.cardioMinutes) || 0;
    const strengthMin = parseInt(calorieData.strengthMinutes) || 0;

    if (cardioMin <= 0 && strengthMin <= 0) {
      this.setData({
        'calorieData.cardioCalories': 0,
        'calorieData.strengthCalories': 0,
        'calorieData.trainCalories': ''
      });
      this.calculateTDEE();
      return;
    }

    const cardioCalories = this.calculateCardioCalories(cardioMin);
    const strengthCalories = this.calculateStrengthCalories(strengthMin);
    const totalCalories = cardioCalories + strengthCalories;

    this.setData({
      'calorieData.cardioCalories': cardioCalories,
      'calorieData.strengthCalories': strengthCalories,
      'calorieData.trainCalories': totalCalories || ''
    });
    this.calculateTDEE();
  },

  // 计算BMI
  calculateBMI() {
    const calorieData = this.data.calorieData || {};
    const { height, weight } = calorieData;
    
    if (!height || !weight) {
      this.setData({
        'profileData.bmi': '',
        'profileData.bmiStatus': ''
      });
      return;
    }

    const heightNum = parseFloat(height) || 0;
    const weightNum = parseFloat(weight) || 0;

    if (heightNum <= 0 || weightNum <= 0) {
      this.setData({
        'profileData.bmi': '',
        'profileData.bmiStatus': ''
      });
      return;
    }

    const heightInMeters = heightNum / 100;
    const bmi = (weightNum / (heightInMeters * heightInMeters)).toFixed(1);
    let bmiStatus = '';

    if (bmi < 18.5) {
      bmiStatus = '偏瘦';
    } else if (bmi >= 18.5 && bmi < 24) {
      bmiStatus = '正常';
    } else if (bmi >= 24 && bmi < 28) {
      bmiStatus = '偏胖';
    } else {
      bmiStatus = '肥胖';
    }

    this.setData({
      'profileData.bmi': bmi,
      'profileData.bmiStatus': bmiStatus
    });
  },

  // 计算营养素分配
  calculateNutrition() {
    const calorieData = this.data.calorieData || {};
    const { weight, nutritionMode, tdee } = calorieData;
    
    if (!weight || !nutritionMode) {
      this.setData({ 'calorieData.nutrition': {} });
      return;
    }

    const weightNum = parseFloat(weight) || 0;
    if (weightNum <= 0) {
      this.setData({ 'calorieData.nutrition': {} });
      return;
    }

    const app = getApp();
    let nutrition = {};

    if (nutritionMode === 'bulk') {
      nutrition = app.calculateBulkNutrition(weightNum);
    } else if (nutritionMode === 'cut') {
      nutrition = app.calculateCutNutrition(weightNum);
    } else if (nutritionMode === 'custom') {
      // 自定义模式需要传递tdee参数
      nutrition = app.calculateCustomNutrition(calorieData.customNutrition, tdee);
    }

    this.setData({ 'calorieData.nutrition': nutrition });
  },

  // 计算减脂预测
  calculatePrediction() {
    const predictionData = this.data.predictionData || {};
    const { initialWeight, targetWeight, monthlyLossPercent } = predictionData;
    
    if (!initialWeight || !targetWeight || !monthlyLossPercent) {
      this.setData({
        'predictionData.totalLoss': '',
        'predictionData.predictMonths': '',
        'predictionData.predictWeeks': '',
        'predictionData.predictDays': '',
        'predictionData.monthlyLoss': '',
        'predictionData.weeklyLoss': ''
      });
      return;
    }

    const initialWeightNum = parseFloat(initialWeight) || 0;
    const targetWeightNum = parseFloat(targetWeight) || 0;
    const percentNum = parseFloat(monthlyLossPercent) || 0;

    if (initialWeightNum <= 0 || targetWeightNum <= 0 || percentNum <= 0) {
      this.setData({
        'predictionData.totalLoss': '',
        'predictionData.predictMonths': '',
        'predictionData.predictWeeks': '',
        'predictionData.predictDays': '',
        'predictionData.monthlyLoss': '',
        'predictionData.weeklyLoss': ''
      });
      return;
    }

    const totalLoss = (initialWeightNum - targetWeightNum).toFixed(1);
    const monthlyLoss = (initialWeightNum * percentNum / 100).toFixed(1);
    const months = Math.ceil(totalLoss / monthlyLoss);
    const weeks = Math.floor((totalLoss % monthlyLoss) / (monthlyLoss / 4));
    const days = Math.floor((totalLoss % monthlyLoss) % (monthlyLoss / 4) / (monthlyLoss / 28));
    const weeklyLoss = (monthlyLoss / 4).toFixed(2);

    this.setData({
      'predictionData.totalLoss': totalLoss,
      'predictionData.predictMonths': months,
      'predictionData.predictWeeks': weeks,
      'predictionData.predictDays': days,
      'predictionData.monthlyLoss': monthlyLoss,
      'predictionData.weeklyLoss': weeklyLoss
    });
  },

  // 保存减脂目标
  savePredictionTarget() {
    // 保存预测数据到本地存储
    const predictionData = this.data.predictionData || {};
    wx.setStorage({
      key: 'predictionData',
      data: {
        initialWeight: predictionData.initialWeight || '',
        targetWeight: predictionData.targetWeight || '',
        monthlyLossPercent: predictionData.monthlyLossPercent || ''
      }
    });
    wx.showToast({
      title: '目标已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // 跳转到体重记录页面
  goToWeightRecord() {
    // 先保存当前预测数据到本地存储，供体重记录页读取
    const predictionData = this.data.predictionData || {};
    wx.setStorage({
      key: 'predictionData',
      data: {
        initialWeight: predictionData.initialWeight || '',
        targetWeight: predictionData.targetWeight || '',
        monthlyLossPercent: predictionData.monthlyLossPercent || ''
      }
    });
    wx.navigateTo({
      url: '/pages/weight-record/weight-record'
    });
  },

  // ==================== 日历打卡功能 ====================

  // 初始化日历
  initCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    this.setData({
      calendarYear: year,
      calendarMonth: month
    });
    this.generateCalendarDays(year, month);
  },

  // 上一个月
  prevMonth() {
    let year = this.data.calendarYear;
    let month = this.data.calendarMonth - 1;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.setData({ calendarYear: year, calendarMonth: month });
    this.generateCalendarDays(year, month);
  },

  // 下一个月
  nextMonth() {
    let year = this.data.calendarYear;
    let month = this.data.calendarMonth + 1;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.setData({ calendarYear: year, calendarMonth: month });
    this.generateCalendarDays(year, month);
  },

  // 生成日历天数据
  generateCalendarDays(year, month) {
    const today = new Date();
    const todayStr = this.formatDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate());

    // 加载打卡记录
    let checkinRecords = {};
    try {
      checkinRecords = wx.getStorageSync('checkinRecords') || {};
    } catch (e) {
      checkinRecords = {};
    }

    // 本月第一天和最后一天
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0=周日

    // 上个月填充
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    const days = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = month - 1 <= 0 ? 12 : month - 1;
      const y = month - 1 <= 0 ? year - 1 : year;
      const dateStr = this.formatDateStr(y, m, d);
      days.push({
        day: d,
        dateStr: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasCheckin: !!checkinRecords[dateStr]
      });
    }

    // 本月天数
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = this.formatDateStr(year, month, d);
      days.push({
        day: d,
        dateStr: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        hasCheckin: !!checkinRecords[dateStr]
      });
    }

    // 下个月填充（填充到满42格，即6行）
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = month + 1 > 12 ? 1 : month + 1;
      const y = month + 1 > 12 ? year + 1 : year;
      const dateStr = this.formatDateStr(y, m, d);
      days.push({
        day: d,
        dateStr: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasCheckin: !!checkinRecords[dateStr]
      });
    }

    this.setData({ calendarDays: days });
  },

  // 格式化日期字符串 YYYY-MM-DD
  formatDateStr(year, month, day) {
    const m = month < 10 ? '0' + month : '' + month;
    const d = day < 10 ? '0' + day : '' + day;
    return year + '-' + m + '-' + d;
  },

  // 点击日期
  onDayTap(e) {
    const dateStr = e.currentTarget.dataset.date;
    const isCurrent = e.currentTarget.dataset.isCurrent;
    if (!isCurrent) return; // 只允许点击当月日期

    // 加载已有打卡数据
    let checkinRecords = {};
    try {
      checkinRecords = wx.getStorageSync('checkinRecords') || {};
    } catch (e) {
      checkinRecords = {};
    }

    const existingData = checkinRecords[dateStr] || {};

    this.setData({
      showCheckinModal: true,
      checkinDate: dateStr,
      checkinData: {
        waterCount: existingData.waterCount || '',
        trainMinutes: existingData.trainMinutes || '',
        dietRecord: existingData.dietRecord || ''
      }
    });
  },

  // 关闭打卡弹窗
  closeCheckinModal() {
    this.setData({ showCheckinModal: false });
  },

  // 喝水次数输入
  onWaterInput(e) {
    this.setData({ 'checkinData.waterCount': e.detail.value });
  },

  // 训练时长输入
  onTrainMinutesInput(e) {
    this.setData({ 'checkinData.trainMinutes': e.detail.value });
  },

  // 饮食记录输入
  onDietInput(e) {
    this.setData({ 'checkinData.dietRecord': e.detail.value });
  },

  // 保存打卡
  saveCheckin() {
    const dateStr = this.data.checkinDate;
    const checkinData = this.data.checkinData;

    if (!checkinData.waterCount && !checkinData.trainMinutes && !checkinData.dietRecord) {
      wx.showToast({
        title: '请至少填写一项',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    try {
      let checkinRecords = wx.getStorageSync('checkinRecords') || {};
      checkinRecords[dateStr] = {
        waterCount: checkinData.waterCount,
        trainMinutes: checkinData.trainMinutes,
        dietRecord: checkinData.dietRecord,
        timestamp: new Date().getTime()
      };
      wx.setStorageSync('checkinRecords', checkinRecords);

      this.setData({ showCheckinModal: false });

      // 刷新日历显示
      this.generateCalendarDays(this.data.calendarYear, this.data.calendarMonth);

      wx.showToast({
        title: '打卡成功',
        icon: 'success',
        duration: 1500
      });
    } catch (e) {
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 1500
      });
    }
  },

  // 跳转到训练计划页面
  goToTrainingPlan() {
    wx.navigateTo({
      url: '/pages/training-plan/training-plan'
    });
  },

  // 跳转到饮食计划页面
  goToDietPlan() {
    wx.navigateTo({
      url: '/pages/diet-plan/diet-plan'
    });
  }
});
