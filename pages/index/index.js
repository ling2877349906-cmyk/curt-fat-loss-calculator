Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],

    // 热量计算页
    calorieData: {
      gender: null,
      age: '',
      height: '',
      weight: '',
      trainTime: '',
      trainIntensity: null,
      bmr: null,
      trainCalories: null,
      tdee: null,
      nutritionMode: null,
      customNutrition: {
        carbs: '',
        protein: '',
        fat: ''
      },
      nutrition: {
        carbs: 0,
        carbsGrams: 0,
        protein: 0,
        proteinGrams: 0,
        fat: 0,
        fatGrams: 0,
        carbsDay4: 0,
        carbsGramsDay4: 0,
        proteinDay4: 0,
        proteinGramsDay4: 0,
        fatDay4: 0,
        fatGramsDay4: 0
      }
    },

    // 减脂预测页
    predictionData: {
      initialWeight: '',
      targetWeight: '',
      monthlyLossPercent: null,
      totalLoss: 0,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      monthlyLoss: 0,
      weeklyLoss: 0
    },

    // 个人页
    profileData: {
      bmi: null,
      bmiStatus: '',
      currentWeight: null,
      targetWeight: null
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
    // 切换Tab时同步数据
    this.syncAllData();
  },

  // 同步所有数据到全局
  syncAllData() {
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 性别选择 ====================
  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      'calorieData.gender': gender
    });
    this.calculateBMR();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 年龄输入 ====================
  onAgeInput(e) {
    const age = e.detail.value;
    this.setData({
      'calorieData.age': age
    });
    if (age) {
      this.calculateBMR();
      this.calculateBMI();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 身高输入 ====================
  onHeightInput(e) {
    const height = e.detail.value;
    this.setData({
      'calorieData.height': height
    });
    if (height) {
      this.calculateBMR();
      this.calculateBMI();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 体重输入 ====================
  onWeightInput(e) {
    const weight = e.detail.value;
    this.setData({
      'calorieData.weight': weight
    });
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
    this.setData({
      'calorieData.trainTime': trainTime
    });
    if (trainTime) {
      this.calculateTrainCalories();
      this.saveToGlobalData();
    }
  },

  // ==================== 热量计算页 - 训练强度选择 ====================
  onIntensityChange(e) {
    const intensity = parseInt(e.currentTarget.dataset.intensity);
    this.setData({
      'calorieData.trainIntensity': intensity
    });
    this.calculateTrainCalories();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 营养模式选择 ====================
  onNutritionModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      'calorieData.nutritionMode': mode
    });
    // 重置自定义营养数据
    if (mode === 'custom') {
      this.setData({
        'calorieData.customNutrition': {
          carbs: '',
          protein: '',
          fat: ''
        }
      });
    }
    this.calculateNutrition();
    this.saveToGlobalData();
  },

  // ==================== 热量计算页 - 自定义营养输入 ====================
  onCustomCarbsInput(e) {
    const carbs = e.detail.value;
    this.setData({
      'calorieData.customNutrition.carbs': carbs
    });
    if (carbs) {
      this.calculateNutrition();
      this.saveToGlobalData();
    }
  },

  onCustomProteinInput(e) {
    const protein = e.detail.value;
    this.setData({
      'calorieData.customNutrition.protein': protein
    });
    if (protein) {
      this.calculateNutrition();
      this.saveToGlobalData();
    }
  },

  onCustomFatInput(e) {
    const fat = e.detail.value;
    this.setData({
      'calorieData.customNutrition.fat': fat
    });
    if (fat) {
      this.calculateNutrition();
      this.saveToGlobalData();
    }
  },

  // ==================== 减脂预测页 - 初始体重输入 ====================
  onInitialWeightInput(e) {
    const weight = e.detail.value;
    this.setData({
      'predictionData.initialWeight': weight
    });
    if (weight) {
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  // ==================== 减脂预测页 - 目标体重输入 ====================
  onTargetWeightInput(e) {
    const weight = e.detail.value;
    this.setData({
      'predictionData.targetWeight': weight
    });
    if (weight) {
      this.calculatePrediction();
      this.saveToGlobalData();
    }
  },

  // ==================== 减脂预测页 - 减重比例调整 ====================
  decreasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent;
    if (!percent) {
      percent = 3; // 默认3%
    } else {
      percent = percent - 0.5;
    }
    percent = Math.max(1, percent);
    this.setData({
      'predictionData.monthlyLossPercent': parseFloat(percent.toFixed(1))
    });
    this.calculatePrediction();
    this.saveToGlobalData();
  },

  increasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent;
    if (!percent) {
      percent = 3; // 默认3%
    } else {
      percent = percent + 0.5;
    }
    percent = Math.min(5, percent);
    this.setData({
      'predictionData.monthlyLossPercent': parseFloat(percent.toFixed(1))
    });
    this.calculatePrediction();
    this.saveToGlobalData();
  },

  savePredictionTarget() {
    const { initialWeight, targetWeight, monthlyLossPercent } = this.data.predictionData;
    if (!initialWeight || !targetWeight || !monthlyLossPercent) {
      wx.showToast({
        title: '请填写完整数据',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.showToast({
      title: '目标已保存',
      icon: 'success',
      duration: 1500
    });
    this.saveToGlobalData();
  },

  // ==================== 计算逻辑 ====================
  calculateBMR() {
    const app = getApp();
    const { gender, age, height, weight } = this.data.calorieData;

    // 转换为数字
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    const bmr = app.calculateBMR(gender, weightNum, heightNum, ageNum);
    
    this.setData({
      'calorieData.bmr': bmr
    });

    // 计算TDEE
    this.calculateTDEE();
  },

  calculateTrainCalories() {
    const app = getApp();
    const { trainTime, trainIntensity } = this.data.calorieData;

    // 转换为数字
    const trainTimeNum = parseFloat(trainTime);

    const trainCalories = app.calculateTrainCalories(trainTimeNum, trainIntensity);

    this.setData({
      'calorieData.trainCalories': trainCalories
    });

    // 计算TDEE
    this.calculateTDEE();
  },

  calculateTDEE() {
    const app = getApp();
    const { bmr, trainCalories } = this.data.calorieData;

    const tdee = app.calculateTDEE(bmr, trainCalories);

    this.setData({
      'calorieData.tdee': tdee
    });

    // 计算营养素
    this.calculateNutrition();
  },

  calculateNutrition() {
    const app = getApp();
    const { tdee, nutritionMode, customNutrition, weight } = this.data.calorieData;

    // 转换为数字
    const weightNum = parseFloat(weight);

    let nutrition = {
      carbs: 0,
      carbsGrams: 0,
      protein: 0,
      proteinGrams: 0,
      fat: 0,
      fatGrams: 0,
      carbsDay4: 0,
      carbsGramsDay4: 0,
      proteinDay4: 0,
      proteinGramsDay4: 0,
      fatDay4: 0,
      fatGramsDay4: 0
    };

    if (nutritionMode === 'bulk' && tdee && weightNum) {
      nutrition = app.calculateBulkNutrition(tdee, weightNum);
    } else if (nutritionMode === 'cut' && tdee && weightNum) {
      nutrition = app.calculateCutNutrition(tdee, weightNum);
    } else if (nutritionMode === 'custom' && tdee) {
      const carbsNum = parseFloat(customNutrition.carbs);
      const proteinNum = parseFloat(customNutrition.protein);
      const fatNum = parseFloat(customNutrition.fat);
      
      if (carbsNum && proteinNum && fatNum) {
        nutrition = app.calculateCustomNutrition(tdee, {
          carbs: carbsNum,
          protein: proteinNum,
          fat: fatNum
        });
      }
    }

    this.setData({
      'calorieData.nutrition': nutrition
    });
  },

  calculateBMI() {
    const app = getApp();
    const { weight, height } = this.data.calorieData;

    // 转换为数字
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    let bmiResult = { bmi: null, status: '' };
    if (weightNum && heightNum) {
      bmiResult = app.calculateBMI(weightNum, heightNum);
    }

    this.setData({
      'profileData.bmi': bmiResult.bmi,
      'profileData.bmiStatus': bmiResult.status,
      'profileData.currentWeight': weightNum
    });
  },

  calculatePrediction() {
    const app = getApp();
    const { initialWeight, targetWeight, monthlyLossPercent } = this.data.predictionData;

    // 转换为数字
    const initialWeightNum = parseFloat(initialWeight);
    const targetWeightNum = parseFloat(targetWeight);

    let result = {
      totalLoss: 0,
      monthlyLoss: 0,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      weeklyLoss: 0
    };

    if (initialWeightNum && targetWeightNum && monthlyLossPercent) {
      result = app.calculatePrediction(initialWeightNum, targetWeightNum, monthlyLossPercent);
    }

    this.setData({
      'predictionData.totalLoss': result.totalLoss,
      'predictionData.monthlyLoss': result.monthlyLoss,
      'predictionData.predictMonths': result.predictMonths,
      'predictionData.predictWeeks': result.predictWeeks,
      'predictionData.predictDays': result.predictDays,
      'predictionData.weeklyLoss': result.weeklyLoss
    });
  }
});
