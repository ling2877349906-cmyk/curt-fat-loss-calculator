Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],

    // 热量计算页
    calorieData: {
      gender: 'male',
      age: 22,
      height: 172,
      weight: 60,
      trainTime: 0,
      trainIntensity: 8,
      bmr: 0,
      trainCalories: 0,
      tdee: 0,
      nutritionMode: '532',
      customNutrition: {
        carbs: 50,
        protein: 30,
        fat: 20
      },
      nutrition: {
        carbs: 0,
        carbsGrams: 0,
        protein: 0,
        proteinGrams: 0,
        fat: 0,
        fatGrams: 0
      }
    },

    // 减脂预测页
    predictionData: {
      initialWeight: 60,
      targetWeight: 50,
      monthlyLossPercent: 3,
      totalLoss: 10,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      monthlyLoss: 0,
      weeklyLoss: 0
    },

    // 个人页
    profileData: {
      bmi: 0,
      bmiStatus: '',
      currentWeight: 60,
      targetWeight: 50
    }
  },

  onLoad() {
    const app = getApp();
    this.setData({
      calorieData: app.globalData.calorieData,
      predictionData: app.globalData.predictionData,
      profileData: app.globalData.profileData
    });
    this.calculateAll();
  },

  onShow() {
    const app = getApp();
    this.setData({
      calorieData: app.globalData.calorieData,
      predictionData: app.globalData.predictionData,
      profileData: app.globalData.profileData
    });
  },

  // ==================== Tab切换 ====================
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  // ==================== 热量计算页 ====================
  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    const calorieData = this.data.calorieData;
    calorieData.gender = gender;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onAgeInput(e) {
    const age = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.age = age;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onHeightInput(e) {
    const height = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.height = height;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onWeightInput(e) {
    const weight = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.weight = weight;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onTrainTimeInput(e) {
    const trainTime = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.trainTime = trainTime;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onIntensityChange(e) {
    const intensity = parseInt(e.currentTarget.dataset.intensity);
    const calorieData = this.data.calorieData;
    calorieData.trainIntensity = intensity;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onNutritionModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    const calorieData = this.data.calorieData;
    calorieData.nutritionMode = mode;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onCustomCarbsInput(e) {
    const carbs = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.customNutrition.carbs = carbs;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onCustomProteinInput(e) {
    const protein = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.customNutrition.protein = protein;
    this.setData({ calorieData });
    this.calculateAll();
  },

  onCustomFatInput(e) {
    const fat = parseInt(e.detail.value) || 0;
    const calorieData = this.data.calorieData;
    calorieData.customNutrition.fat = fat;
    this.setData({ calorieData });
    this.calculateAll();
  },

  // ==================== 减脂预测页 ====================
  onInitialWeightInput(e) {
    const weight = parseInt(e.detail.value) || 0;
    const predictionData = this.data.predictionData;
    predictionData.initialWeight = weight;
    this.setData({ predictionData });
    this.calculatePrediction();
  },

  onTargetWeightInput(e) {
    const weight = parseInt(e.detail.value) || 0;
    const predictionData = this.data.predictionData;
    predictionData.targetWeight = weight;
    this.setData({ predictionData });
    this.calculatePrediction();
  },

  onMonthlyLossPercentChange(e) {
    const percent = parseFloat(e.detail.value) || 0;
    const predictionData = this.data.predictionData;
    predictionData.monthlyLossPercent = percent;
    this.setData({ predictionData });
    this.calculatePrediction();
  },

  decreasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent - 0.5;
    percent = Math.max(1, percent);
    const predictionData = this.data.predictionData;
    predictionData.monthlyLossPercent = percent;
    this.setData({ predictionData });
    this.calculatePrediction();
  },

  increasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent + 0.5;
    percent = Math.min(5, percent);
    const predictionData = this.data.predictionData;
    predictionData.monthlyLossPercent = percent;
    this.setData({ predictionData });
    this.calculatePrediction();
  },

  savePredictionTarget() {
    wx.showToast({
      title: '目标已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // ==================== 计算逻辑 ====================
  calculateAll() {
    const app = getApp();
    const { gender, age, height, weight, trainTime, trainIntensity, nutritionMode, customNutrition } = this.data.calorieData;

    // 计算BMR
    const bmr = app.calculateBMR(gender, weight, height, age);

    // 计算训练热量
    const trainCalories = app.calculateTrainCalories(trainTime, trainIntensity);

    // 计算TDEE
    const tdee = app.calculateTDEE(bmr, trainCalories);

    // 计算营养素
    const nutrition = app.calculateNutrition(tdee, nutritionMode, customNutrition);

    // 计算BMI
    const bmiResult = app.calculateBMI(weight, height);

    const calorieData = this.data.calorieData;
    calorieData.bmr = bmr;
    calorieData.trainCalories = trainCalories;
    calorieData.tdee = tdee;
    calorieData.nutrition = nutrition;

    const profileData = this.data.profileData;
    profileData.bmi = bmiResult.bmi;
    profileData.bmiStatus = bmiResult.status;
    profileData.currentWeight = weight;

    this.setData({
      calorieData,
      profileData
    });

    // 保存到全局数据
    app.globalData.calorieData = calorieData;
    app.globalData.profileData = profileData;
    app.saveData();
  },

  calculatePrediction() {
    const app = getApp();
    const { initialWeight, targetWeight, monthlyLossPercent } = this.data.predictionData;

    const result = app.calculatePrediction(initialWeight, targetWeight, monthlyLossPercent);

    const predictionData = this.data.predictionData;
    predictionData.totalLoss = result.totalLoss;
    predictionData.monthlyLoss = result.monthlyLoss;
    predictionData.predictMonths = result.predictMonths;
    predictionData.predictWeeks = result.predictWeeks;
    predictionData.predictDays = result.predictDays;
    predictionData.weeklyLoss = result.weeklyLoss;

    this.setData({ predictionData });

    // 保存到全局数据
    const app_instance = getApp();
    app_instance.globalData.predictionData = predictionData;
    app_instance.saveData();
  }
});
