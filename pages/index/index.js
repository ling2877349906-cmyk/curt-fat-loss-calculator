Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],

    // 热量计算页 - 所有字段初始为空
    calorieData: {
      gender: '',
      age: '',
      height: '',
      weight: '',
      trainTime: '',
      trainIntensity: '',
      bmr: '',
      trainCalories: '',
      tdee: '',
      nutritionMode: '',
      customNutrition: {
        carbs: '',
        protein: '',
        fat: ''
      },
      nutrition: {
        carbs: '',
        carbsGrams: '',
        protein: '',
        proteinGrams: '',
        fat: '',
        fatGrams: '',
        carbsDay4: '',
        carbsGramsDay4: '',
        proteinDay4: '',
        proteinGramsDay4: '',
        fatDay4: '',
        fatGramsDay4: ''
      }
    },

    // 减脂预测页 - 所有字段初始为空
    predictionData: {
      initialWeight: '',
      targetWeight: '',
      monthlyLossPercent: '',
      totalLoss: '',
      predictMonths: '',
      predictWeeks: '',
      predictDays: '',
      monthlyLoss: '',
      weeklyLoss: ''
    },

    // 个人页 - 所有字段初始为空
    profileData: {
      bmi: '',
      bmiStatus: '',
      currentWeight: '',
      targetWeight: ''
    }
  },

  onLoad() {
    this.loadGlobalData();
  },

  onShow() {
    this.loadGlobalData();
  },

  // 从全局数据加载
  loadGlobalData() {
    const app = getApp();
    this.setData({
      calorieData: JSON.parse(JSON.stringify(app.globalData.calorieData)),
      predictionData: JSON.parse(JSON.stringify(app.globalData.predictionData)),
      profileData: JSON.parse(JSON.stringify(app.globalData.profileData))
    });
  },

  // 保存到全局数据
  saveToGlobalData() {
    const app = getApp();
    app.globalData.calorieData = JSON.parse(JSON.stringify(this.data.calorieData));
    app.globalData.predictionData = JSON.parse(JSON.stringify(this.data.predictionData));
    app.globalData.profileData = JSON.parse(JSON.stringify(this.data.profileData));
    app.saveData();
  },

  // ==================== Tab切换 ====================
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
    this.syncAllData();
  },

  // 同步所有数据到全局
  syncAllData() {
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 性别选择 ====================
  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ 'calorieData.gender': gender });
    this.calculateBMR();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 年龄输入 ====================
  onAgeInput(e) {
    const age = e.detail.value;
    this.setData({ 'calorieData.age': age });
    if (age) {
      this.calculateBMR();
      this.calculateBMI();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 身高输入 ====================
  onHeightInput(e) {
    const height = e.detail.value;
    this.setData({ 'calorieData.height': height });
    if (height) {
      this.calculateBMR();
      this.calculateBMI();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 体重输入 ====================
  onWeightInput(e) {
    const weight = e.detail.value;
    this.setData({ 'calorieData.weight': weight });
    if (weight) {
      this.calculateBMR();
      this.calculateBMI();
      this.calculateNutrition();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 训练时间输入 ====================
  onTrainTimeInput(e) {
    const trainTime = e.detail.value;
    this.setData({ 'calorieData.trainTime': trainTime });
    if (trainTime) {
      this.calculateTrainCalories();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 训练强度选择 ====================
  onIntensityChange(e) {
    const intensity = e.currentTarget.dataset.intensity;
    this.setData({ 'calorieData.trainIntensity': intensity });
    this.calculateTrainCalories();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 营养模式选择 ====================
  onNutritionModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 'calorieData.nutritionMode': mode });
    if (mode === 'custom') {
      this.setData({
        'calorieData.customNutrition.carbs': '',
        'calorieData.customNutrition.protein': '',
        'calorieData.customNutrition.fat': ''
      });
    }
    this.calculateNutrition();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 自定义营养输入 ====================
  onCustomCarbsInput(e) {
    const carbs = e.detail.value;
    this.setData({ 'calorieData.customNutrition.carbs': carbs });
    this.calculateNutrition();
    this.saveToGlobalData();
  },

  onCustomProteinInput(e) {
    const protein = e.detail.value;
    this.setData({ 'calorieData.customNutrition.protein': protein });
    this.calculateNutrition();
    this.saveToGlobalData();
  },

  onCustomFatInput(e) {
    const fat = e.detail.value;
    this.setData({ 'calorieData.customNutrition.fat': fat });
    this.calculateNutrition();
    this.saveToGlobalData();
  },

  // ==================== 减脂预测页 - 初始体重输入 ====================
  onInitialWeightInput(e) {
    const initialWeight = e.detail.value;
    this.setData({ 'predictionData.initialWeight': initialWeight });
    if (initialWeight) {
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  // ==================== 减脂预测页 - 目标体重输入 ====================
  onTargetWeightInput(e) {
    const targetWeight = e.detail.value;
    this.setData({ 'predictionData.targetWeight': targetWeight });
    if (targetWeight) {
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  // ==================== 减脂预测页 - 百分比增减 ====================
  decreasePercent() {
    let percent = parseInt(this.data.predictionData.monthlyLossPercent) || 0;
    if (percent > 1) {
      percent--;
      this.setData({ 'predictionData.monthlyLossPercent': percent });
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  increasePercent() {
    let percent = parseInt(this.data.predictionData.monthlyLossPercent) || 0;
    if (percent < 5) {
      percent++;
      this.setData({ 'predictionData.monthlyLossPercent': percent });
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  // ==================== 计算函数 ====================

  // 计算BMR（基础代谢率）
  calculateBMR() {
    const { gender, age, height, weight } = this.data.calorieData;
    
    if (!gender || !age || !height || !weight) {
      this.setData({
        'calorieData.bmr': '',
        'calorieData.tdee': '',
        'calorieData.trainCalories': ''
      });
      return;
    }

    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      return;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    bmr = Math.round(bmr);
    this.setData({ 'calorieData.bmr': bmr });
    this.calculateTDEE();
    this.calculateBMI();
  },

  // 计算TDEE（每日总热量消耗）
  calculateTDEE() {
    const { bmr, trainCalories } = this.data.calorieData;
    
    if (!bmr) {
      this.setData({ 'calorieData.tdee': '' });
      return;
    }

    const trainCaloriesNum = parseFloat(trainCalories) || 0;
    const tdee = Math.round(parseFloat(bmr) + trainCaloriesNum);
    this.setData({ 'calorieData.tdee': tdee });
  },

  // 计算训练消耗热量
  calculateTrainCalories() {
    const { weight, trainTime, trainIntensity } = this.data.calorieData;
    
    if (!weight || !trainTime || !trainIntensity) {
      this.setData({ 'calorieData.trainCalories': '' });
      return;
    }

    const weightNum = parseFloat(weight);
    const trainTimeNum = parseFloat(trainTime);
    const intensityNum = parseFloat(trainIntensity);

    if (weightNum <= 0 || trainTimeNum <= 0 || intensityNum <= 0) {
      return;
    }

    const trainCalories = Math.round(trainTimeNum * weightNum * intensityNum / 100);
    this.setData({ 'calorieData.trainCalories': trainCalories });
    this.calculateTDEE();
  },

  // 计算BMI
  calculateBMI() {
    const { height, weight } = this.data.calorieData;
    
    if (!height || !weight) {
      this.setData({
        'profileData.bmi': '',
        'profileData.bmiStatus': ''
      });
      return;
    }

    const heightNum = parseFloat(height) / 100;
    const weightNum = parseFloat(weight);

    if (heightNum <= 0 || weightNum <= 0) {
      return;
    }

    const bmi = (weightNum / (heightNum * heightNum)).toFixed(1);
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
    const { weight, nutritionMode } = this.data.calorieData;
    
    if (!weight || !nutritionMode) {
      this.setData({
        'calorieData.nutrition': {
          carbs: '',
          carbsGrams: '',
          protein: '',
          proteinGrams: '',
          fat: '',
          fatGrams: '',
          carbsDay4: '',
          carbsGramsDay4: '',
          proteinDay4: '',
          proteinGramsDay4: '',
          fatDay4: '',
          fatGramsDay4: ''
        }
      });
      return;
    }

    const weightNum = parseFloat(weight);
    if (weightNum <= 0) {
      return;
    }

    const app = getApp();
    let nutrition = {};

    if (nutritionMode === 'bulk') {
      // 增肌模式
      nutrition = app.calculateBulkNutrition(weightNum);
    } else if (nutritionMode === 'cut') {
      // 减脂模式
      nutrition = app.calculateCutNutrition(weightNum);
    } else if (nutritionMode === 'custom') {
      // 自定义模式
      nutrition = app.calculateCustomNutrition(this.data.calorieData.customNutrition);
    }

    this.setData({ 'calorieData.nutrition': nutrition });
  },

  // 计算减脂预测
  calculatePrediction() {
    const { initialWeight, targetWeight, monthlyLossPercent } = this.data.predictionData;
    
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

    const initialWeightNum = parseFloat(initialWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const percentNum = parseFloat(monthlyLossPercent);

    if (initialWeightNum <= 0 || targetWeightNum <= 0 || percentNum <= 0) {
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
    this.saveToGlobalData();
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
