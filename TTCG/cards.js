// TTCG 卡牌数据 —— 30 张头像重绘卡
// keywords: taunt(嘲讽) / charge(冲锋)
// battlecry / deathrattle: { type, amount }
//   type: heal_hero | draw | damage_random | damage_all | damage_face | buff_all_atk

const CARD_POOL = [
  {
    id: "bigmilkbottle", art: "assets/BigMilkBottle.jpg",
    name: "发光的奶瓶", title: "补给道具",
    cost: 1, atk: 1, hp: 2,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "闪闪发光的一瓶，喝了就有精神。"
  },
  {
    id: "cyberhono", art: "assets/CyberHono.jpg",
    name: "赛博应援", title: "元气偶像",
    cost: 3, atk: 3, hp: 3,
    keywords: ["charge"],
    flavor: "眨个眼，比个心，冲上舞台！"
  },
  {
    id: "dth", art: "assets/DTH34106926.jpg",
    name: "D 叔", title: "熊猫头把关人",
    cost: 4, atk: 3, hp: 5,
    keywords: ["taunt"],
    flavor: "「私は D おじさんです。」想过去？先问问叔。"
  },
  {
    id: "evey", art: "assets/EveY448.jpg",
    name: "HOPE 毛线帽", title: "温柔的希望",
    cost: 3, atk: 2, hp: 4,
    keywords: [], battlecry: { type: "draw", amount: 1 },
    flavor: "帽子上写着 HOPE，看到她就有了盼头。"
  },
  {
    id: "fossil", art: "assets/Fossil_kolya.jpg",
    name: "云朵化石", title: "软乎乎的墙",
    cost: 2, atk: 1, hp: 3,
    keywords: ["taunt"],
    flavor: "看起来软软的，撞上去才知道是化石。"
  },
  {
    id: "gamersfox", art: "assets/Gamers_foxs.jpg",
    name: "墨镜狐", title: "Deal With It",
    cost: 3, atk: 4, hp: 2,
    keywords: ["charge"],
    flavor: "像素墨镜一戴，身后烟花自己会响。"
  },
  {
    id: "hhcvhw", art: "assets/HhcvhW18221.jpg",
    name: "光环少女", title: "发圈即光环",
    cost: 5, atk: 4, hp: 5,
    keywords: [], battlecry: { type: "heal_hero", amount: 3 },
    flavor: "头顶那圈到底是发饰还是光环，她不肯说。"
  },
  {
    id: "hoshino", art: "assets/HoshinoStarry.jpg",
    name: "星野丸子", title: "投掷星星",
    cost: 2, atk: 2, hp: 2,
    keywords: [], battlecry: { type: "damage_random", amount: 1 },
    flavor: "发卡上的星星是可以摘下来扔的。"
  },
  {
    id: "nagi", art: "assets/Kazama_Nagi_.jpg",
    name: "骄傲飘带", title: "吐舌小旗手",
    cost: 2, atk: 2, hp: 3,
    keywords: [], battlecry: { type: "heal_hero", amount: 1 },
    flavor: "蝴蝶结的颜色，就是她想说的话。"
  },
  {
    id: "kisslight", art: "assets/Kiss_light233.jpg",
    name: "猫爪马克杯", title: "热饮补给站",
    cost: 4, atk: 3, hp: 4,
    keywords: [], battlecry: { type: "heal_hero", amount: 3 },
    flavor: "杯子里装的是热可可，还有一点猫毛。"
  },
  {
    id: "leucht", art: "assets/Leuchtkorper.jpg",
    name: "大檐帽小不点", title: "冲呀！",
    cost: 1, atk: 2, hp: 1,
    keywords: ["charge"],
    flavor: "帽子比人大，胆子比帽子大。"
  },
  {
    id: "milksu", art: "assets/MilkSU_Official.jpg",
    name: "ALL PERFECT", title: "全连冲击波",
    cost: 6, atk: 5, hp: 5,
    keywords: [], battlecry: { type: "damage_all", amount: 1 },
    flavor: "全连的瞬间，整个对面的血条都晃了一下。"
  },
  {
    id: "nankyu", art: "assets/NankyuSeiichi.jpg",
    name: "困困猫", title: "睡着也能挡刀",
    cost: 3, atk: 2, hp: 5,
    keywords: ["taunt"],
    flavor: "……嗯……再打五分钟……"
  },
  {
    id: "oppofans", art: "assets/OPPOFANS114514.jpg",
    name: "贝雷帽摇滚", title: "标准偶像身材",
    cost: 4, atk: 4, hp: 4,
    keywords: [],
    flavor: "🤟 摆好姿势，嘟嘴，出道。"
  },
  {
    id: "nanodesu", art: "assets/Sp7R9gFmEr35361.jpg",
    name: "是提督夹！", title: "行礼的水手服",
    cost: 2, atk: 1, hp: 4,
    keywords: [], deathrattle: { type: "draw", amount: 1 },
    flavor: "退场的时候也要好好提裙行礼，なのです！"
  },
  {
    id: "supernoob", art: "assets/SupernoobQvq.jpg",
    name: "叼烟老猫", title: "最后一口",
    cost: 5, atk: 5, hp: 4,
    keywords: [], deathrattle: { type: "damage_face", amount: 2 },
    flavor: "烟灰弹在你脸上，这是它的临别赠礼。"
  },
  {
    id: "taro", art: "assets/TaroLeohearts.jpg",
    name: "红格子日常", title: "豆眼小人",
    cost: 1, atk: 1, hp: 1,
    keywords: [], deathrattle: { type: "damage_random", amount: 1 },
    flavor: "倒下时格子散开，扎到了旁边的人。"
  },
  {
    id: "tenpenny", art: "assets/TenpennyL62429.jpg",
    name: "电线杆旅人", title: "淡淡的存在",
    cost: 1, atk: 0, hp: 3,
    keywords: ["taunt"],
    flavor: "画得很淡，但确实一直站在那里替你挡着。"
  },
  {
    id: "twiligh", art: "assets/Twiligh56382101.jpg",
    name: "火柴胡子", title: "共产猫耳帽",
    cost: 4, atk: 5, hp: 3,
    keywords: [], battlecry: { type: "damage_face", amount: 2 },
    flavor: "入场先划一根胡子，火星子溅到对面脸上。"
  },
  {
    id: "yume", art: "assets/Yume33550336.jpg",
    name: "梦境音符", title: "开场 BGM",
    cost: 3, atk: 0, hp: 4,
    keywords: [], battlecry: { type: "buff_all_atk", amount: 1 },
    flavor: "月牙为谱，星星为拍，全场士气 +1。"
  },
  {
    id: "oquery", art: "assets/__oQuery.jpg",
    name: "芭比女孩", title: "回眸一咬",
    cost: 2, atk: 3, hp: 1,
    keywords: [],
    flavor: "I'm a barbie girl——虎牙是真的会咬人。"
  },
  {
    id: "ciwei", art: "assets/_ciweiqwq_.jpg",
    name: "吸果汁刺猬", title: "袋装小猫",
    cost: 2, atk: 2, hp: 2,
    keywords: [], battlecry: { type: "heal_hero", amount: 1 },
    flavor: "整只装在果汁袋里，顺便分你一口。"
  },
  {
    id: "akihiro", art: "assets/akihiro_0313.jpg",
    name: "饿饿狐", title: "看到你就流口水",
    cost: 5, atk: 6, hp: 4,
    keywords: [],
    flavor: "她没有恶意，只是真的很饿。"
  },
  {
    id: "luoshuyao", art: "assets/luoshuyao.jpg",
    name: "鲨鱼尾", title: "龇牙冲刺",
    cost: 4, atk: 4, hp: 3,
    keywords: ["charge"],
    flavor: "尾巴一甩，咬合力测试现在开始。"
  },
  {
    id: "seikuu", art: "assets/seikuushona.jpg",
    name: "眯眯笑", title: "元气满满",
    cost: 1, atk: 1, hp: 2,
    keywords: [], battlecry: { type: "heal_hero", amount: 1 },
    flavor: "笑到眼睛都不见了，看的人也跟着回血。"
  },
  {
    id: "tange", art: "assets/tangeorange.jpg",
    name: "小被被", title: "星光斗篷",
    cost: 3, atk: 2, hp: 4,
    keywords: ["taunt"],
    flavor: "裹上小被被，谁都别想碰到后面的人。"
  },
  {
    id: "tina", art: "assets/tina63991073.jpg",
    name: "杂鱼～❤", title: "指名嘲笑",
    cost: 6, atk: 5, hp: 6,
    keywords: [], battlecry: { type: "damage_random", amount: 3 },
    flavor: "「雑～魚♪」被点名的那个当场破防。"
  },
  {
    id: "unknown", art: "assets/unknown8m9s.jpg",
    name: "全黑之影", title: "???",
    cost: 7, atk: 7, hp: 7,
    keywords: [],
    flavor: "这张图是纯黑的。没人知道里面画了什么。"
  },
  {
    id: "yanbo", art: "assets/yanbo2004.jpg",
    name: "螺旋凝视", title: "望向漩涡的人",
    cost: 4, atk: 3, hp: 5,
    keywords: [], battlecry: { type: "damage_random", amount: 2 },
    flavor: "他抬头看的那个螺旋，也会看向你的随从。"
  },
  {
    id: "yuki", art: "assets/yuki233dayo.jpg",
    name: "RBQ 研究员", title: "偷偷学习中",
    cost: 2, atk: 2, hp: 3,
    keywords: [], battlecry: { type: "draw", amount: 1 },
    flavor: "躲在墙后翻书，被发现了也装没事。"
  },
  {
    id: "miracle", art: "assets/1034_MIRACLE.jpg",
    name: "惠方卷", title: "闭眼默许愿",
    cost: 2, atk: 1, hp: 3,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "朝着吉位整根吃完，中途不能说话。"
  },
  {
    id: "billchen", art: "assets/BillChen2001.jpg",
    name: "戒指与慌张", title: "突然被求婚的脸",
    cost: 3, atk: 3, hp: 3,
    keywords: [], deathrattle: { type: "draw", amount: 1 },
    flavor: "手上的戒指还没捂热，事情就变得复杂起来。"
  },
  {
    id: "paulk", art: "assets/PaulKochakin.jpg",
    name: "红中！", title: "雀桌上的狐狸",
    cost: 4, atk: 4, hp: 3,
    keywords: ["charge"],
    flavor: "中！中啊！中嘞！——摸到就是胡，胡了就是冲。"
  },
  {
    id: "yini", art: "assets/Yini_Ruohong.jpg",
    name: "得意吐舌", title: "仰头小表情",
    cost: 1, atk: 2, hp: 1,
    keywords: [],
    flavor: "嘿嘿，就是在说你哦。"
  },
  {
    id: "riko", art: "assets/kusunoki_riko.jpg",
    name: "爱心呆毛", title: "贝雷帽与星星",
    cost: 4, atk: 3, hp: 5,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "呆毛弯成爱心的时候，心情一定不坏。"
  },
  {
    id: "qianye", art: "assets/qianye_zhenyu.jpg",
    name: "花帽鼓嘴", title: "夏日遮阳墙",
    cost: 3, atk: 2, hp: 5,
    keywords: ["taunt"],
    flavor: "草帽一压，嘴一鼓，谁也别想越过去。"
  },
  {
    id: "saya", art: "assets/saya_nikaido.jpg",
    name: "圆眼直视", title: "盯——",
    cost: 3, atk: 3, hp: 4,
    keywords: [],
    flavor: "她只是看着你，你就先心虚了。"
  },
  {
    id: "sumika", art: "assets/sumika_wallace.jpg",
    name: "神明保佑", title: "兔子发卡的祈祷",
    cost: 5, atk: 3, hp: 6,
    keywords: [], battlecry: { type: "heal_hero", amount: 4 },
    flavor: "「神様救ってくれる。」双手合十，就真的有点灵。"
  },
  {
    id: "tennjou", art: "assets/tennjoukouki.jpg",
    name: "皇冠公主", title: "王室仪仗",
    cost: 5, atk: 4, hp: 6,
    keywords: ["taunt"],
    flavor: "眨一只眼是礼节，挡在你面前是职责。"
  },
  {
    id: "cirno9", art: "assets/locklo01.jpg",
    name: "冰之妖精", title: "自称最强⑨",
    cost: 4, atk: 3, hp: 4,
    keywords: [], battlecry: { type: "damage_all", amount: 1 },
    flavor: "叼着冰棍登场，六片冰翼一抖，全场降温。"
  },
];
