Page({
  data: {
    activeTab: 0,
    tabs: ['热量计算', '减脂预测', '个人'],

    // 热量计算页
    calorieData: {
      gender: null,
      age: null,
      height: null,
      weight: null,
      trainTime: null,
      trainIntensity: null,
      bmr: null,
      trainCalories: null,
      tdee: null,
      nutritionMode: null,
      customNutrition: {
        carbs: null,
        protein: null,
        fat: null
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
      initialWeight: null,
      targetWeight: null,
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

  // 使用observers监听数据变化，实现实时计算
  observers: {
    'calorieData.age, calorieData.height, calorieData.weight, calorieData.gender': function() {
      this.calculateBMR();
    },
    'calorieData.trainTime, calorieData.trainIntensity': function() {
      this.calculateTrainCalories();
    },
    'calorieData.bmr, calorieData.trainCalories': function() {
      this.calculateTDEE();
    },
    'calorieData.tdee, calorieData.nutritionMode, calorieData.customNutrition.carbs, calorieData.customNutrition.protein, calorieData.customNutrition.fat': function() {
      this.calculateNutrition();
    },
    'calorieData.weight, calorieData.height': function() {
      this.calculateBMI();
    },
    'predictionData.initialWeight, predictionData.targetWeight, predictionData.monthlyLossPercent': function() {
      this.calculatePrediction();
    }
  },

  onLoad() {
    const app = getApp();
    // 深拷贝数据，避免引用问题
    this.setData({
      calorieData: JSON.parse(JSON.stringify(app.globalData.calorieData)),
      predictionData: JSON.parse(JSON.stringify(app.globalData.predictionData)),
      profileData: JSON.parse(JSON.stringify(app.globalData.profileData))
    });
  },

  onShow() {
    const app = getApp();
    // 深拷贝数据，避免引用问题
    this.setData({
      calorieData: JSON.parse(JSON.stringify(app.globalData.calorieData)),
      predictionData: JSON.parse(JSON.stringify(app.globalData.predictionData)),
      profileData: JSON.parse(JSON.stringify(app.globalData.profileData))
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
    this.setData({
      'calorieData.gender': gender
    });
  },

  onIntensityChange(e) {
    const intensity = parseInt(e.currentTarget.dataset.intensity);
    this.setData({
      'calorieData.trainIntensity': intensity
    });
  },

  onNutritionModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      'calorieData.nutritionMode': mode
    });
    // 重置自定义营养数据
    if (mode === 'custom') {
      this.setData({
        'calorieData.customNutrition': {
          carbs: null,
          protein: null,
          fat: null
        }
      });
    }
  },

  // ==================== 减脂预测页 ====================
  decreasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent;
    if (!percent) return;
    percent = percent - 0.5;
    percent = Math.max(1, percent);
    this.setData({
      'predictionData.monthlyLossPercent': parseFloat(percent.toFixed(1))
    });
  },

  increasePercent() {
    let percent = this.data.predictionData.monthlyLossPercent;
    if (!percent) return;
    percent = percent + 0.5;
    percent = Math.min(5, percent);
    this.setData({
      'predictionData.monthlyLossPercent': parseFloat(percent.toFixed(1))
    });
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
    // 保存到全局数据
    const app = getApp();
    app.globalData.predictionData = JSON.parse(JSON.stringify(this.data.predictionData));
    app.saveData();
  },

  // ==================== 计算逻辑 ====================
  calculateBMR() {
    const app = getApp();
    const { gender, age, height, weight } = this.data.calorieData;

    const bmr = app.calculateBMR(gender, weight, height, age);
    
    this.setData({
      'calorieData.bmr': bmr
    });

    // 保存到全局数据
    app.globalData.calorieData.bmr = bmr;
    app.saveData();
  },

  calculateTrainCalories() {
    const app = getApp();
    const { trainTime, trainIntensity } = this.data.calorieData;

    const trainCalories = app.calculateTrainCalories(trainTime, trainIntensity);

    this.setData({
      'calorieData.trainCalories': trainCalories
    });

    // 保存到全局数据
    app.globalData.calorieData.trainCalories = trainCalories;
    app.saveData();
  },

  calculateTDEE() {
    const app = getApp();
    const { bmr, trainCalories } = this.data.calorieData;

    const tdee = app.calculateTDEE(bmr, trainCalories);

    this.setData({
      'calorieData.tdee': tdee
    });

    // 保存到全局数据
    app.globalData.calorieData.tdee = tdee;
    app.saveData();
  },

  calculateNutrition() {
    const app = getApp();
    const { tdee, nutritionMode, customNutrition, weight } = this.data.calorieData;

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

    if (nutritionMode === 'bulk' && tdee && weight) {
      nutrition = app.calculateBulkNutrition(tdee, weight);
    } else if (nutritionMode === 'cut' && tdee && weight) {
      nutrition = app.calculateCutNutrition(tdee, weight);
    } else if (nutritionMode === 'custom' && tdee) {
      nutrition = app.calculateCustomNutrition(tdee, customNutrition);
    }

    this.setData({
      'calorieData.nutrition': nutrition
    });

    // 保存到全局数据
    app.globalData.calorieData.nutrition = nutrition;
    app.saveData();
  },

  calculateBMI() {
    const app = getApp();
    const { weight, height } = this.data.calorieData;

    let bmiResult = { bmi: null, status: '' };
    if (weight && height) {
      bmiResult = app.calculateBMI(weight, height);
    }

    this.setData({
      'profileData.bmi': bmiResult.bmi,
      'profileData.bmiStatus': bmiResult.status,
      'profileData.currentWeight': weight
    });

    // 保存到全局数据
    app.globalData.profileData.bmi = bmiResult.bmi;
    app.globalData.profileData.bmiStatus = bmiResult.status;
    app.globalData.profileData.currentWeight = weight;
    app.saveData();
  },

  calculatePrediction() {
    const app = getApp();
    const { initialWeight, targetWeight, monthlyLossPercent } = this.data.predictionData;

    let result = {
      totalLoss: 0,
      monthlyLoss: 0,
      predictMonths: 0,
      predictWeeks: 0,
      predictDays: 0,
      weeklyLoss: 0
    };

    if (initialWeight && targetWeight && monthlyLossPercent) {
      result = app.calculatePrediction(initialWeight, targetWeight, monthlyLossPercent);
    }

    this.setData({
      'predictionData.totalLoss': result.totalLoss,
      'predictionData.monthlyLoss': result.monthlyLoss,
      'predictionData.predictMonths': result.predictMonths,
      'predictionData.predictWeeks': result.predictWeeks,
      'predictionData.predictDays': result.predictDays,
      'predictionData.weeklyLoss': result.weeklyLoss
    });

    // 保存到全局数据
    app.globalData.predictionData = JSON.parse(JSON.stringify(this.data.predictionData));
    app.saveData();
  }
});
