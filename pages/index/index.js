Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],
    // 不设置任何初始值
  },

  onLoad() {
    // 页面加载时不设置任何初始值
  },

  onShow() {
    // 页面显示时不设置任何初始值
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

  // ==================== 热量计算页 - 训练时间输入 ====================
  onTrainTimeInput(e) {
    const trainTime = e.detail.value;
    this.setData({ 'calorieData.trainTime': trainTime });
    this.calculateTrainCalories();
  },

  // ==================== 热量计算页 - 训练强度选择 ====================
  onIntensityChange(e) {
    const intensity = e.currentTarget.dataset.intensity;
    this.setData({ 'calorieData.trainIntensity': intensity });
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
  },

  // 计算训练消耗热量
  calculateTrainCalories() {
    const calorieData = this.data.calorieData || {};
    const { weight, trainTime, trainIntensity } = calorieData;
    
    if (!weight || !trainTime || !trainIntensity) {
      this.setData({ 'calorieData.trainCalories': '' });
      return;
    }

    const weightNum = parseFloat(weight) || 0;
    const trainTimeNum = parseFloat(trainTime) || 0;
    const intensityNum = parseFloat(trainIntensity) || 0;

    if (weightNum <= 0 || trainTimeNum <= 0 || intensityNum <= 0) {
      this.setData({ 'calorieData.trainCalories': '' });
      return;
    }

    const trainCalories = Math.round(trainTimeNum * weightNum * intensityNum / 100);
    this.setData({ 'calorieData.trainCalories': trainCalories || '' });
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
    const { weight, nutritionMode } = calorieData;
    
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
      nutrition = app.calculateCustomNutrition(calorieData.customNutrition);
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
    wx.showToast({
      title: '目标已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // 记录体重
  recordWeight() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 1500
    });
  }
});
