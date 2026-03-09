Page({
  data: {
    dayList: [1, 2, 3, 4, 5, 6, 7],
    currentDay: 1,
    exercises: [
      { name: '', sets: '' },
      { name: '', sets: '' },
      { name: '', sets: '' }
    ]
  },

  // 所有7天的训练数据缓存
  allDaysData: {},

  onLoad() {
    this.loadAllData();
    this.loadDayData(1);
  },

  // 加载所有训练数据
  loadAllData() {
    try {
      const data = wx.getStorageSync('trainingPlan') || {};
      this.allDaysData = data;
    } catch (e) {
      this.allDaysData = {};
    }
  },

  // 加载某天的训练数据
  loadDayData(day) {
    const dayData = this.allDaysData[day];
    if (dayData && dayData.length > 0) {
      this.setData({ exercises: dayData });
    } else {
      this.setData({
        exercises: [
          { name: '', sets: '' },
          { name: '', sets: '' },
          { name: '', sets: '' }
        ]
      });
    }
  },

  // 保存当前天数据到缓存
  saveDayDataToCache() {
    this.allDaysData[this.data.currentDay] = JSON.parse(JSON.stringify(this.data.exercises));
  },

  // 切换天数
  switchDay(e) {
    const day = e.currentTarget.dataset.day;
    if (day === this.data.currentDay) return;

    // 先保存当前天数据
    this.saveDayDataToCache();

    this.setData({ currentDay: day });
    this.loadDayData(day);
  },

  // 动作名称输入
  onExerciseNameInput(e) {
    const index = e.currentTarget.dataset.index;
    const key = 'exercises[' + index + '].name';
    this.setData({ [key]: e.detail.value });
  },

  // 组数输入
  onExerciseSetsInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value.replace(/[^0-9]/g, '');
    const key = 'exercises[' + index + '].sets';
    this.setData({ [key]: value });
  },

  // 添加动作
  addExercise() {
    const exercises = this.data.exercises;
    exercises.push({ name: '', sets: '' });
    this.setData({ exercises: exercises });
  },

  // 删除动作
  deleteExercise(e) {
    const index = e.currentTarget.dataset.index;
    const exercises = this.data.exercises;
    if (exercises.length <= 1) {
      wx.showToast({ title: '至少保留一个动作', icon: 'none' });
      return;
    }
    exercises.splice(index, 1);
    this.setData({ exercises: exercises });
  },

  // 保存计划
  savePlan() {
    // 先保存当前天
    this.saveDayDataToCache();

    try {
      wx.setStorageSync('trainingPlan', this.allDaysData);
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
