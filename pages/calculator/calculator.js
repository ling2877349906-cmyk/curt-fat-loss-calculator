Page({
  data: {
    gender: 'male',
    age: 22,
    height: 172,
    weight: 60,
    trainingTime: 0,
    trainingIntensity: 8,
    trainingCalories: 0,
    bmr: 0,
    tdee: 0,
    nutritionRatio: '532',
    customRatio: {
      carbs: 50,
      protein: 30,
      fat: 20
    },
    nutrition: {
      carbs: { grams: 0, calories: 0, percent: 50 },
      protein: { grams: 0, calories: 0, percent: 30 },
      fat: { grams: 0, calories: 0, percent: 20 }
    }
  },

  onLoad() {
    const app = getApp();
    this.setData({
      gender: app.globalData.gender,
      age: app.globalData.age,
      height: app.globalData.height,
      weight: app.globalData.weight,
      trainingTime: app.globalData.trainingTime,
      trainingIntensity: app.globalData.trainingIntensity,
      nutritionRatio: app.globalData.nutritionRatio,
      customRatio: app.globalData.customRatio
    });
    this.calculateAll();
  },

  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ gender });
    const app = getApp();
    app.globalData.gender = gender;
    this.calculateAll();
  },

  onAgeInput(e) {
    let age = parseInt(e.detail.value) || 0;
    age = Math.max(15, Math.min(100, age));
    this.setData({ age });
    const app = getApp();
    app.globalData.age = age;
    this.calculateAll();
  },

  onHeightInput(e) {
    let height = parseInt(e.detail.value) || 0;
    height = Math.max(100, Math.min(250, height));
    this.setData({ height });
    const app = getApp();
    app.globalData.height = height;
    this.calculateAll();
  },

  onWeightInput(e) {
    let weight = parseInt(e.detail.value) || 0;
    weight = Math.max(30, Math.min(200, weight));
    this.setData({ weight });
    const app = getApp();
    app.globalData.weight = weight;
    this.calculateAll();
  },

  onTrainingTimeInput(e) {
    let trainingTime = parseInt(e.detail.value) || 0;
    trainingTime = Math.max(0, Math.min(300, trainingTime));
    this.setData({ trainingTime });
    const app = getApp();
    app.globalData.trainingTime = trainingTime;
    this.calculateAll();
  },

  onIntensityChange(e) {
    const trainingIntensity = parseInt(e.currentTarget.dataset.intensity);
    this.setData({ trainingIntensity });
    const app = getApp();
    app.globalData.trainingIntensity = trainingIntensity;
    this.calculateAll();
  },

  onRatioChange(e) {
    const nutritionRatio = e.currentTarget.dataset.ratio;
    this.setData({ nutritionRatio });
    const app = getApp();
    app.globalData.nutritionRatio = nutritionRatio;
    this.calculateNutrition();
  },

  onCustomRatioInput(e) {
    const type = e.currentTarget.dataset.type;
    let value = parseInt(e.detail.value) || 0;
    value = Math.max(0, Math.min(100, value));
    
    const customRatio = this.data.customRatio;
    customRatio[type] = value;
    this.setData({ customRatio });
    
    const app = getApp();
    app.globalData.customRatio = customRatio;
    this.calculateNutrition();
  },

  calculateAll() {
    this.calculateBMR();
    this.calculateTDEE();
    this.calculateNutrition();
  },

  calculateBMR() {
    const { gender, weight, height, age } = this.data;
    let bmr;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    bmr = Math.round(bmr);
    this.setData({ bmr });
    
    const app = getApp();
    app.globalData.bmr = bmr;
    return bmr;
  },

  calculateTDEE() {
    const { trainingTime, trainingIntensity } = this.data;
    const trainingCalories = trainingTime * trainingIntensity;
    const tdee = this.data.bmr + trainingCalories;
    
    this.setData({ trainingCalories, tdee });
    
    const app = getApp();
    app.globalData.tdee = tdee;
    return tdee;
  },

  calculateNutrition() {
    const { tdee, nutritionRatio, customRatio } = this.data;
    let carbsPercent, proteinPercent, fatPercent;
    
    if (nutritionRatio === '532') {
      carbsPercent = 50;
      proteinPercent = 30;
      fatPercent = 20;
    } else if (nutritionRatio === '442') {
      carbsPercent = 40;
      proteinPercent = 40;
      fatPercent = 20;
    } else {
      carbsPercent = customRatio.carbs;
      proteinPercent = customRatio.protein;
      fatPercent = customRatio.fat;
    }
    
    // 计算克数
    const carbsGrams = Math.round((tdee * carbsPercent / 100) / 4);
    const proteinGrams = Math.round((tdee * proteinPercent / 100) / 4);
    const fatGrams = Math.round((tdee * fatPercent / 100) / 9);
    
    // 计算热量
    const carbsCalories = Math.round(carbsGrams * 4);
    const proteinCalories = Math.round(proteinGrams * 4);
    const fatCalories = Math.round(fatGrams * 9);
    
    const nutrition = {
      carbs: { grams: carbsGrams, calories: carbsCalories, percent: carbsPercent },
      protein: { grams: proteinGrams, calories: proteinCalories, percent: proteinPercent },
      fat: { grams: fatGrams, calories: fatCalories, percent: fatPercent }
    };
    
    this.setData({ nutrition });
    return nutrition;
  },

  onReset() {
    const app = getApp();
    app.globalData.gender = 'male';
    app.globalData.age = 22;
    app.globalData.height = 172;
    app.globalData.weight = 60;
    app.globalData.trainingTime = 0;
    app.globalData.trainingIntensity = 8;
    
    this.setData({
      gender: 'male',
      age: 22,
      height: 172,
      weight: 60,
      trainingTime: 0,
      trainingIntensity: 8
    });
    
    this.calculateAll();
    wx.showToast({
      title: '已重置',
      icon: 'success',
      duration: 1500
    });
  }
});
