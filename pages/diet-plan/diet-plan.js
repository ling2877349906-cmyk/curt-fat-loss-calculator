var foodDB = require('../../shared/foodDatabase.js');

Page({
  data: {
    dayList: [1, 2, 3, 4, 5, 6, 7],
    currentDay: 1,
    meals: [
      {
        key: 'breakfast',
        label: '早餐',
        emoji: '🌅',
        foods: [{ name: '', grams: '', carbs: 0, protein: 0, fat: 0, found: false }],
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0
      },
      {
        key: 'lunch',
        label: '午餐',
        emoji: '☀️',
        foods: [{ name: '', grams: '', carbs: 0, protein: 0, fat: 0, found: false }],
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0
      },
      {
        key: 'dinner',
        label: '晚餐',
        emoji: '🌙',
        foods: [{ name: '', grams: '', carbs: 0, protein: 0, fat: 0, found: false }],
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0
      }
    ],
    dailyTotalCarbs: 0,
    dailyTotalProtein: 0,
    dailyTotalFat: 0
  },

  // 所有7天的饮食数据缓存
  allDaysData: {},

  onLoad() {
    this.loadAllData();
    this.loadDayData(1);
  },

  // 加载所有饮食数据
  loadAllData() {
    try {
      var data = wx.getStorageSync('dietPlan') || {};
      this.allDaysData = data;
    } catch (e) {
      this.allDaysData = {};
    }
  },

  // 加载某天的饮食数据
  loadDayData(day) {
    var dayData = this.allDaysData[day];
    var meals;

    if (dayData) {
      meals = [
        this.buildMealData('breakfast', '早餐', '🌅', dayData.breakfast),
        this.buildMealData('lunch', '午餐', '☀️', dayData.lunch),
        this.buildMealData('dinner', '晚餐', '🌙', dayData.dinner)
      ];
    } else {
      meals = [
        this.buildMealData('breakfast', '早餐', '🌅', null),
        this.buildMealData('lunch', '午餐', '☀️', null),
        this.buildMealData('dinner', '晚餐', '🌙', null)
      ];
    }

    this.setData({ meals: meals });
    this.updateDailyTotal();
  },

  // 构建餐次数据
  buildMealData(key, label, emoji, savedFoods) {
    var foods;
    if (savedFoods && savedFoods.length > 0) {
      foods = savedFoods.map(function(f) {
        var result = foodDB.calculateNutrition(f.name, f.grams);
        return {
          name: f.name || '',
          grams: f.grams || '',
          carbs: result ? result.carbs : 0,
          protein: result ? result.protein : 0,
          fat: result ? result.fat : 0,
          found: result ? result.found : false
        };
      });
    } else {
      foods = [{ name: '', grams: '', carbs: 0, protein: 0, fat: 0, found: false }];
    }

    var totalCarbs = 0, totalProtein = 0, totalFat = 0;
    foods.forEach(function(f) {
      if (f.found) {
        totalCarbs += f.carbs;
        totalProtein += f.protein;
        totalFat += f.fat;
      }
    });

    return {
      key: key,
      label: label,
      emoji: emoji,
      foods: foods,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10
    };
  },

  // 保存当前天数据到缓存
  saveDayDataToCache() {
    var meals = this.data.meals;
    var dayData = {};
    meals.forEach(function(meal) {
      dayData[meal.key] = meal.foods.map(function(f) {
        return {
          name: f.name,
          grams: f.grams,
          carbs: f.carbs,
          protein: f.protein,
          fat: f.fat
        };
      });
    });
    this.allDaysData[this.data.currentDay] = dayData;
  },

  // 切换天数
  switchDay(e) {
    var day = e.currentTarget.dataset.day;
    if (day === this.data.currentDay) return;

    // 先保存当前天
    this.saveDayDataToCache();

    this.setData({ currentDay: day });
    this.loadDayData(day);
  },

  // 找到餐次在 meals 数组中的索引
  findMealIndex(mealKey) {
    var meals = this.data.meals;
    for (var i = 0; i < meals.length; i++) {
      if (meals[i].key === mealKey) return i;
    }
    return -1;
  },

  // 食材名称输入
  onFoodNameInput(e) {
    var mealKey = e.currentTarget.dataset.meal;
    var foodIdx = e.currentTarget.dataset.index;
    var mealIdx = this.findMealIndex(mealKey);
    if (mealIdx === -1) return;

    var key = 'meals[' + mealIdx + '].foods[' + foodIdx + '].name';
    this.setData({ [key]: e.detail.value });

    // 重新计算营养素
    this.recalcFood(mealIdx, foodIdx);
  },

  // 克数输入
  onFoodGramsInput(e) {
    var mealKey = e.currentTarget.dataset.meal;
    var foodIdx = e.currentTarget.dataset.index;
    var mealIdx = this.findMealIndex(mealKey);
    if (mealIdx === -1) return;

    var value = e.detail.value.replace(/[^0-9]/g, '');
    var key = 'meals[' + mealIdx + '].foods[' + foodIdx + '].grams';
    this.setData({ [key]: value });

    // 重新计算营养素
    this.recalcFood(mealIdx, foodIdx);
  },

  // 重新计算单个食材的营养素
  recalcFood(mealIdx, foodIdx) {
    var food = this.data.meals[mealIdx].foods[foodIdx];
    var name = food.name;
    var grams = parseInt(food.grams);

    var result = foodDB.calculateNutrition(name, grams);
    var prefix = 'meals[' + mealIdx + '].foods[' + foodIdx + ']';

    if (result) {
      this.setData({
        [prefix + '.carbs']: result.carbs,
        [prefix + '.protein']: result.protein,
        [prefix + '.fat']: result.fat,
        [prefix + '.found']: result.found
      });
    } else {
      this.setData({
        [prefix + '.carbs']: 0,
        [prefix + '.protein']: 0,
        [prefix + '.fat']: 0,
        [prefix + '.found']: false
      });
    }

    // 更新餐次汇总
    this.updateMealTotal(mealIdx);
  },

  // 更新餐次汇总
  updateMealTotal(mealIdx) {
    var foods = this.data.meals[mealIdx].foods;
    var totalCarbs = 0, totalProtein = 0, totalFat = 0;
    foods.forEach(function(f) {
      if (f.found) {
        totalCarbs += f.carbs;
        totalProtein += f.protein;
        totalFat += f.fat;
      }
    });

    var prefix = 'meals[' + mealIdx + ']';
    this.setData({
      [prefix + '.totalCarbs']: Math.round(totalCarbs * 10) / 10,
      [prefix + '.totalProtein']: Math.round(totalProtein * 10) / 10,
      [prefix + '.totalFat']: Math.round(totalFat * 10) / 10
    });

    this.updateDailyTotal();
  },

  // 更新当日总汇总
  updateDailyTotal() {
    var meals = this.data.meals;
    var totalCarbs = 0, totalProtein = 0, totalFat = 0;
    meals.forEach(function(meal) {
      totalCarbs += meal.totalCarbs || 0;
      totalProtein += meal.totalProtein || 0;
      totalFat += meal.totalFat || 0;
    });

    this.setData({
      dailyTotalCarbs: Math.round(totalCarbs * 10) / 10,
      dailyTotalProtein: Math.round(totalProtein * 10) / 10,
      dailyTotalFat: Math.round(totalFat * 10) / 10
    });
  },

  // 添加食材
  addFood(e) {
    var mealKey = e.currentTarget.dataset.meal;
    var mealIdx = this.findMealIndex(mealKey);
    if (mealIdx === -1) return;

    var foods = this.data.meals[mealIdx].foods;
    foods.push({ name: '', grams: '', carbs: 0, protein: 0, fat: 0, found: false });
    var key = 'meals[' + mealIdx + '].foods';
    this.setData({ [key]: foods });
  },

  // 删除食材
  deleteFood(e) {
    var mealKey = e.currentTarget.dataset.meal;
    var foodIdx = e.currentTarget.dataset.index;
    var mealIdx = this.findMealIndex(mealKey);
    if (mealIdx === -1) return;

    var foods = this.data.meals[mealIdx].foods;
    if (foods.length <= 1) {
      wx.showToast({ title: '至少保留一项食材', icon: 'none' });
      return;
    }
    foods.splice(foodIdx, 1);
    var key = 'meals[' + mealIdx + '].foods';
    this.setData({ [key]: foods });

    this.updateMealTotal(mealIdx);
  },

  // 保存计划
  savePlan() {
    // 先保存当前天
    this.saveDayDataToCache();

    try {
      wx.setStorageSync('dietPlan', this.allDaysData);
      wx.showToast({
        title: '保存成功',
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
  }
});
