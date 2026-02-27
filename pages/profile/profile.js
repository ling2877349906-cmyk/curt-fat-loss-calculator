Page({
  data: {
    age: 22,
    weight: 60,
    height: 172,
    gender: 'male',
    tdee: 0,
    bmi: 0,
    bmiStatus: '正常',
    bmiPercent: 50,
    targetWeight: 50,
    initialWeight: 60,
    progressPercent: 0,
    nutrition: {
      carbs: { grams: 0, calories: 0, percent: 50 },
      protein: { grams: 0, calories: 0, percent: 30 },
      fat: { grams: 0, calories: 0, percent: 20 }
    },
    qaList: [
      {
        id: 1,
        question: '这个小程序是怎么来的？为什么要做这个小程序？',
        answer: '机缘巧合，在路上刷到了如何计算减脂热量的视频，觉得博主讲的很详细，自己又经常在食谱推荐APP里看到减脂热量计算，每次都要手动计算，不一定会很快。所以就想开发一个小程序，让大家去海边健身的食谱推荐功能。不过我自己做主要还是出于兴趣，后面也会想一些有特色的功能，同时全程自己设计，想方案、开发实现、测试发布真的很有意思。',
        expanded: false
      },
      {
        id: 2,
        question: '后续会上什么功能？',
        answer: '根据你们的反馈，会有体重记录、食谱推荐、热量记录等功能。由于是自己下班时间做，不一定会很快。最近（2024/06/17）刚开启了，在最下面加了一个视频推荐，但保证不会像大家的使用。',
        expanded: false
      },
      {
        id: 3,
        question: '薄荷健康也有这些功能？',
        answer: '是的，其实关于热量计算，每日记录也有很多其他的 App，在食谱推荐推荐里其他推荐功能。不过我自己做主要还是出于兴趣，后面也会想一些有特色的功能，同时全程自己设计，想方案、开发实现、测试发布真的很有意思。',
        expanded: false
      },
      {
        id: 4,
        question: '小程序挂个广告吧！',
        answer: '这个项目纯粹是个人兴趣爱好，本身没有盈利目的。广告位、暂不加。2024/06/17 打脸了，在最下面加了一个视频推荐，但保证不会像大家的使用。',
        expanded: false
      },
      {
        id: 5,
        question: '怎样支持我？',
        answer: '使用、分享、评价就是最大的鼓励和支持。点击小程序右上角的 .... 有体验评价选项，也可以访问我的公众号【蔡文治】点文章和广告。我会有一些收益。',
        expanded: false
      },
      {
        id: 6,
        question: '我发现有BUG！',
        answer: '亲爱的小伙伴留言给我，我看看具体是什么问题，问题回复不及时请见谅。',
        expanded: false
      }
    ]
  },

  onLoad() {
    const app = getApp();
    
    // 获取热量页的数据
    this.setData({
      age: app.globalData.age,
      weight: app.globalData.weight,
      height: app.globalData.height,
      gender: app.globalData.gender,
      tdee: app.globalData.tdee || 0
    });

    // 获取减脂预测页的数据
    const targetWeight = wx.getStorageSync('targetWeight');
    const initialWeight = wx.getStorageSync('initialWeight');
    
    if (targetWeight) {
      this.setData({ targetWeight });
    } else {
      this.setData({ targetWeight: app.globalData.targetWeight });
    }

    if (initialWeight) {
      this.setData({ initialWeight });
    } else {
      this.setData({ initialWeight: app.globalData.initialWeight });
    }

    this.calculateAll();
  },

  onShow() {
    const app = getApp();
    // 每次显示页面时更新数据
    this.setData({
      age: app.globalData.age,
      weight: app.globalData.weight,
      height: app.globalData.height,
      gender: app.globalData.gender
    });
    this.calculateAll();
  },

  calculateAll() {
    this.calculateBMI();
    this.calculateTDEE();
    this.calculateNutrition();
    this.calculateProgress();
  },

  calculateBMI() {
    const { weight, height } = this.data;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiValue = parseFloat(bmi.toFixed(1));

    let bmiStatus = '正常';
    let bmiPercent = 50;

    if (bmi < 18.5) {
      bmiStatus = '偏瘦';
      bmiPercent = 25;
    } else if (bmi >= 18.5 && bmi < 24) {
      bmiStatus = '正常';
      bmiPercent = 50;
    } else if (bmi >= 24 && bmi < 28) {
      bmiStatus = '偏胖';
      bmiPercent = 75;
    } else {
      bmiStatus = '肥胖';
      bmiPercent = 95;
    }

    this.setData({
      bmi: bmiValue,
      bmiStatus: bmiStatus,
      bmiPercent: bmiPercent
    });
  },

  calculateTDEE() {
    const app = getApp();
    const tdee = app.calculateTDEE();
    this.setData({ tdee });
  },

  calculateNutrition() {
    const app = getApp();
    const nutrition = app.getNutritionBreakdown();
    this.setData({ nutrition });
  },

  calculateProgress() {
    const { weight, targetWeight, initialWeight } = this.data;
    const totalNeedToLose = initialWeight - targetWeight;
    const alreadyLost = initialWeight - weight;
    const progressPercent = totalNeedToLose > 0 ? Math.min(100, (alreadyLost / totalNeedToLose) * 100) : 0;
    
    this.setData({ progressPercent: Math.round(progressPercent) });
  },

  toggleQA(e) {
    const id = e.currentTarget.dataset.id;
    const qaList = this.data.qaList;
    const item = qaList.find(q => q.id === id);
    
    if (item) {
      item.expanded = !item.expanded;
      this.setData({ qaList });
    }
  },

  onRecalculate() {
    wx.switchTab({
      url: '/pages/calculator/calculator'
    });
  },

  onRecordWeight() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 1500
    });
  }
});
