App({
  globalData: {
    // 个人基础信息
    userInfo: {
      age: null,           // 年龄（15-100）
      height: null,        // 身高（100-300cm）
      weight: null,        // 体重（30-200kg）
      gender: 'male'       // 性别：male 或 female
    },

    // 运动信息
    exercise: {
      aerobicTime: 0,      // 有氧运动时间（分钟）
      anaerobicTime: 0,    // 无氧运动时间（分钟）
      aerobicCalories: 0,  // 有氧运动消耗热量
      anaerobicCalories: 0 // 无氧运动消耗热量
    },

    // 饮食模式
    dietMode: 'bulk',      // bulk(增肌) / cut(减脂) / custom(自定义)
    customNutrition: {
      carbs: null,         // 自定义碳水（克）
      protein: null,       // 自定义蛋白质（克）
      fat: null            // 自定义脂肪（克）
    },

    // 计算结果
    results: {
      bmr: 0,              // 基础代谢率
      tdee: 0,             // 每日总消耗热量
      bmi: 0,              // BMI指数
      bmiStatus: '',       // BMI状态
      nutrition: {
        carbs: 0,
        protein: 0,
        fat: 0
      },
      nutritionDay4: {     // 减脂模式第4天营养
        carbs: 0,
        protein: 0,
        fat: 0
      }
    },

    // 体重记录
    weightRecords: [],     // [{date: '2026-03-01 10:30:45', weight: 70}, ...]
    targetWeight: null,    // 目标体重
    currentWeight: null    // 当前体重
  },

  onLaunch() {
    // 从本地存储加载数据
    this.loadData();
  },

  // 加载本地存储数据
  loadData() {
    const userInfo = wx.getStorageSync('userInfo');
    const exercise = wx.getStorageSync('exercise');
    const dietMode = wx.getStorageSync('dietMode');
    const customNutrition = wx.getStorageSync('customNutrition');
    const weightRecords = wx.getStorageSync('weightRecords');
    const targetWeight = wx.getStorageSync('targetWeight');
    const currentWeight = wx.getStorageSync('currentWeight');

    if (userInfo) this.globalData.userInfo = userInfo;
    if (exercise) this.globalData.exercise = exercise;
    if (dietMode) this.globalData.dietMode = dietMode;
    if (customNutrition) this.globalData.customNutrition = customNutrition;
    if (weightRecords) this.globalData.weightRecords = weightRecords;
    if (targetWeight) this.globalData.targetWeight = targetWeight;
    if (currentWeight) this.globalData.currentWeight = currentWeight;
  },

  // 保存本地存储数据
  saveData() {
    wx.setStorageSync('userInfo', this.globalData.userInfo);
    wx.setStorageSync('exercise', this.globalData.exercise);
    wx.setStorageSync('dietMode', this.globalData.dietMode);
    wx.setStorageSync('customNutrition', this.globalData.customNutrition);
    wx.setStorageSync('weightRecords', this.globalData.weightRecords);
    wx.setStorageSync('targetWeight', this.globalData.targetWeight);
    wx.setStorageSync('currentWeight', this.globalData.currentWeight);
  },

  // 计算基础代谢率 (BMR)
  calculateBMR() {
    const { gender, weight, height, age } = this.globalData.userInfo;
    
    if (!weight || !height || !age) return 0;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    this.globalData.results.bmr = Math.round(bmr);
    return this.globalData.results.bmr;
  },

  // 计算有氧运动消耗热量
  calculateAerobicCalories() {
    const { weight } = this.globalData.userInfo;
    const { aerobicTime } = this.globalData.exercise;
    
    if (!weight || !aerobicTime) {
      this.globalData.exercise.aerobicCalories = 0;
      return 0;
    }

    // 有氧运动：约 0.1 * 体重(kg) 的热量/分钟
    const calories = Math.round(aerobicTime * weight * 0.1);
    this.globalData.exercise.aerobicCalories = calories;
    return calories;
  },

  // 计算无氧运动消耗热量
  calculateAnaerobicCalories() {
    const { weight } = this.globalData.userInfo;
    const { anaerobicTime } = this.globalData.exercise;
    
    if (!weight || !anaerobicTime) {
      this.globalData.exercise.anaerobicCalories = 0;
      return 0;
    }

    // 无氧运动：约 0.15 * 体重(kg) 的热量/分钟
    const calories = Math.round(anaerobicTime * weight * 0.15);
    this.globalData.exercise.anaerobicCalories = calories;
    return calories;
  },

  // 计算每日总消耗热量 (TDEE)
  calculateTDEE() {
    const bmr = this.calculateBMR();
    const aerobic = this.calculateAerobicCalories();
    const anaerobic = this.calculateAnaerobicCalories();
    
    const tdee = bmr + aerobic + anaerobic;
    this.globalData.results.tdee = tdee;
    return tdee;
  },

  // 计算BMI
  calculateBMI() {
    const { weight, height } = this.globalData.userInfo;
    
    if (!weight || !height) {
      this.globalData.results.bmi = 0;
      this.globalData.results.bmiStatus = '';
      return 0;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    this.globalData.results.bmi = parseFloat(bmi.toFixed(1));

    if (bmi < 18.5) {
      this.globalData.results.bmiStatus = '偏瘦';
    } else if (bmi >= 18.5 && bmi < 24) {
      this.globalData.results.bmiStatus = '正常';
    } else if (bmi >= 24 && bmi < 28) {
      this.globalData.results.bmiStatus = '偏胖';
    } else {
      this.globalData.results.bmiStatus = '肥胖';
    }

    return this.globalData.results.bmi;
  },

  // 计算营养素分配
  calculateNutrition() {
    const { weight } = this.globalData.userInfo;
    const { dietMode, customNutrition } = this.globalData;

    if (!weight) {
      this.globalData.results.nutrition = { carbs: 0, protein: 0, fat: 0 };
      this.globalData.results.nutritionDay4 = { carbs: 0, protein: 0, fat: 0 };
      return;
    }

    let carbs, protein, fat;

    if (dietMode === 'bulk') {
      // 增肌模式
      carbs = Math.round(weight * 4);
      protein = Math.round(weight * 1.9);
      fat = Math.round(weight * 0.8);
    } else if (dietMode === 'cut') {
      // 减脂模式（前3天）
      carbs = Math.round(weight * 1.5);
      protein = Math.round(weight * 1.4);
      fat = Math.round(weight * 1);
    } else if (dietMode === 'custom') {
      // 自定义模式
      carbs = customNutrition.carbs || 0;
      protein = customNutrition.protein || 0;
      fat = customNutrition.fat || 0;
    }

    this.globalData.results.nutrition = { carbs, protein, fat };

    // 减脂模式第4天营养
    if (dietMode === 'cut') {
      const carbsDay4 = Math.round(weight * 4);
      const proteinDay4 = Math.round(weight * 1.4);
      const fatDay4 = Math.round(weight * 0.5);
      this.globalData.results.nutritionDay4 = {
        carbs: carbsDay4,
        protein: proteinDay4,
        fat: fatDay4
      };
    } else {
      this.globalData.results.nutritionDay4 = { carbs: 0, protein: 0, fat: 0 };
    }
  },

  // 记录体重
  recordWeight(weight) {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + ' ' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');

    const record = { date: dateStr, weight: weight };
    
    // 只保留最近7天的记录
    if (!this.globalData.weightRecords) {
      this.globalData.weightRecords = [];
    }

    this.globalData.weightRecords.push(record);
    
    // 保持只有7条记录
    if (this.globalData.weightRecords.length > 7) {
      this.globalData.weightRecords.shift();
    }

    this.globalData.currentWeight = weight;
    this.saveData();
    return record;
  },

  // 获取最近7天的体重记录
  getWeightRecords() {
    return this.globalData.weightRecords || [];
  }
});
