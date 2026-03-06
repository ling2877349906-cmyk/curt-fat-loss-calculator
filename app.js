App({
  globalData: {},

  onLaunch() {
    // 应用启动时不设置任何初始值
  },

  // ==================== BMR计算 ====================
  calculateBMR(gender, age, height, weight) {
    if (!gender || !age || !height || !weight) return null;

    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) return null;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    return Math.round(bmr);
  },

  // ==================== 增肌模式营养计算 ====================
  calculateBulkNutrition(weight) {
    const weightNum = parseFloat(weight);
    if (weightNum <= 0) return {};

    const carbsGrams = Math.round(weightNum * 4);
    const proteinGrams = Math.round(weightNum * 1.9);
    const fatGrams = Math.round(weightNum * 0.8);

    const carbs = Math.round(carbsGrams * 4);
    const protein = Math.round(proteinGrams * 4);
    const fat = Math.round(fatGrams * 9);

    return {
      carbsGrams: carbsGrams,
      carbs: carbs,
      proteinGrams: proteinGrams,
      protein: protein,
      fatGrams: fatGrams,
      fat: fat,
      carbsDay4: '',
      carbsGramsDay4: '',
      proteinDay4: '',
      proteinGramsDay4: '',
      fatDay4: '',
      fatGramsDay4: ''
    };
  },

  // ==================== 减脂模式营养计算 ====================
  calculateCutNutrition(weight) {
    const weightNum = parseFloat(weight);
    if (weightNum <= 0) return {};

    // 前3天
    const carbsGrams = Math.round(weightNum * 1.5);
    const proteinGrams = Math.round(weightNum * 1.4);
    const fatGrams = Math.round(weightNum * 1);

    const carbs = Math.round(carbsGrams * 4);
    const protein = Math.round(proteinGrams * 4);
    const fat = Math.round(fatGrams * 9);

    // 第4天
    const carbsGramsDay4 = Math.round(weightNum * 4);
    const proteinGramsDay4 = Math.round(weightNum * 1.4);
    const fatGramsDay4 = Math.round(weightNum * 0.5);

    const carbsDay4 = Math.round(carbsGramsDay4 * 4);
    const proteinDay4 = Math.round(proteinGramsDay4 * 4);
    const fatDay4 = Math.round(fatGramsDay4 * 9);

    return {
      carbsGrams: carbsGrams,
      carbs: carbs,
      proteinGrams: proteinGrams,
      protein: protein,
      fatGrams: fatGrams,
      fat: fat,
      carbsDay4: carbsDay4,
      carbsGramsDay4: carbsGramsDay4,
      proteinDay4: proteinDay4,
      proteinGramsDay4: proteinGramsDay4,
      fatDay4: fatDay4,
      fatGramsDay4: fatGramsDay4
    };
  },

  // ==================== 自定义模式营养计算 ====================
  calculateCustomNutrition(customData) {
    if (!customData) return {};

    const carbs = parseFloat(customData.carbs) || 0;
    const protein = parseFloat(customData.protein) || 0;
    const fat = parseFloat(customData.fat) || 0;

    const carbsGrams = Math.round(carbs / 4);
    const proteinGrams = Math.round(protein / 4);
    const fatGrams = Math.round(fat / 9);

    return {
      carbsGrams: carbsGrams,
      carbs: carbs,
      proteinGrams: proteinGrams,
      protein: protein,
      fatGrams: fatGrams,
      fat: fat,
      carbsDay4: '',
      carbsGramsDay4: '',
      proteinDay4: '',
      proteinGramsDay4: '',
      fatDay4: '',
      fatGramsDay4: ''
    };
  },

  // ==================== 数据保存 ====================
  saveData() {
    // 保存到本地存储
    wx.setStorage({
      key: 'appData',
      data: this.globalData
    });
  }
});
