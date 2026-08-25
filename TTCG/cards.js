// TTCG 卡牌数据 —— 70 张头像重绘卡
// keywords: taunt(嘲讽) / charge(冲锋) / shield(圣盾) / lifesteal(吸血)
//           poison(剧毒) / windfury(风怒) / grow(成长)
// battlecry / deathrattle: { type, amount }
//   type: heal_hero | draw | damage_random | damage_all | damage_face
//       | buff_all_atk | buff_random_ally | freeze_random

const CARD_POOL = [
  {
    id: "bigmilkbottle", art: "assets/BigMiIkBottIe.jpg",
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
    cost: 4, atk: 2, hp: 6,
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
    cost: 2, atk: 1, hp: 2,
    keywords: ["taunt", "shield"],
    flavor: "看起来软软的，撞上去才知道是化石——第一下根本敲不动。"
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
    keywords: ["shield"], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "头顶那圈是真光环——第一次受伤时会替她碎掉。"
  },
  {
    id: "hoshino", art: "assets/HoshinoStarry.jpg",
    name: "星野丸子", title: "投掷星星",
    cost: 2, atk: 2, hp: 2,
    keywords: [], battlecry: { type: "damage_random", amount: 1 },
    flavor: "发卡上的星星是可以摘下来扔的。"
  },
  {
    id: "nagi", art: "assets/Hoshika_Mahiyo.jpg",
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
    cost: 4, atk: 3, hp: 4,
    keywords: [], battlecry: { type: "buff_random_ally", amount: 2 },
    flavor: "🤟 摆好姿势，嘟嘴，为队友打 call！"
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
    cost: 2, atk: 1, hp: 2,
    keywords: ["poison"],
    flavor: "I'm a barbie girl——那颗虎牙淬了毒，碰到就倒。"
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
    cost: 5, atk: 5, hp: 4,
    keywords: ["lifesteal"],
    flavor: "她没有恶意，只是真的很饿——咬到什么都能回口血。"
  },
  {
    id: "luoshuyao", art: "assets/luoshuyao.jpg",
    name: "鲨鱼尾", title: "龇牙冲刺",
    cost: 4, atk: 3, hp: 4,
    keywords: ["windfury"],
    flavor: "尾巴一甩，咬合力测试现在开始——每回合测两次。"
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
    cost: 7, atk: 6, hp: 6,
    keywords: ["grow"],
    flavor: "这张图是纯黑的。而且每看一眼，黑影就更大一圈。"
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
    cost: 2, atk: 1, hp: 4,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "朝着吉位整根吃完，中途不能说话。"
  },
  {
    id: "billchen", art: "assets/BillChen2001.jpg",
    name: "戒指与慌张", title: "突然被求婚的脸",
    cost: 3, atk: 4, hp: 2,
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
    cost: 4, atk: 2, hp: 6,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "呆毛弯成爱心的时候，心情一定不坏。"
  },
  {
    id: "qianye", art: "assets/qianye_zhenyu.jpg",
    name: "花帽鼓嘴", title: "夏日遮阳伞",
    cost: 3, atk: 2, hp: 4,
    keywords: ["shield"],
    flavor: "草帽一压，嘴一鼓——第一下全被帽檐挡掉了。"
  },
  {
    id: "saya", art: "assets/saya_nikaido.jpg",
    name: "圆眼直视", title: "盯——",
    cost: 3, atk: 2, hp: 3,
    keywords: [], battlecry: { type: "freeze_random", amount: 1 },
    flavor: "她只是看着你，你就僵在原地一动不敢动。"
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
  {
    id: "asakami", art: "assets/AsakamiOfficial.jpg",
    name: "X 发卡", title: "乖巧猫嘴",
    cost: 2, atk: 2, hp: 4,
    keywords: [],
    flavor: "别着 X 发卡，:3 地看着你，什么都不承认。"
  },
  {
    id: "atrice", art: "assets/AtriceUHB.jpg",
    name: "转载禁止结界", title: "無断転載禁止",
    cost: 2, atk: 0, hp: 4,
    keywords: ["taunt"],
    flavor: "REPOST IS PROHIBITED——这行字本身就是一堵墙。"
  },
  {
    id: "fiona", art: "assets/Fiona_Coyn3.jpg",
    name: "狐面繁花", title: "花丛中的狐狸",
    cost: 5, atk: 4, hp: 5,
    keywords: [], battlecry: { type: "damage_random", amount: 2 },
    flavor: "狐狸面具滑到一边，花瓣落下的瞬间已经出手。"
  },
  {
    id: "kisaragi", art: "assets/KisaragiSue.jpg",
    name: "盘腿学姐", title: "坐下聊聊吧",
    cost: 3, atk: 1, hp: 5,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "她盘腿坐下来听你说完，心就不那么累了。"
  },
  {
    id: "naiwenel", art: "assets/Naiwenel.jpg",
    name: "捧花微笑", title: "轻声的问候",
    cost: 2, atk: 1, hp: 3,
    keywords: [], battlecry: { type: "draw", amount: 1 },
    flavor: "她双手捧在胸前，把想说的话都别在了花里。"
  },
  {
    id: "caitiskk", art: "assets/caitiskk.jpg",
    name: "麻花辫旅人", title: "斗篷与远方",
    cost: 3, atk: 3, hp: 4,
    keywords: [], deathrattle: { type: "damage_random", amount: 1 },
    flavor: "倒下的时候，两条长辫子还会甩到人。"
  },
  {
    id: "ciallowo", art: "assets/ciallowo.jpg",
    name: "睡着了", title: "口水冒泡中",
    cost: 1, atk: 0, hp: 3,
    keywords: [], deathrattle: { type: "heal_hero", amount: 2 },
    flavor: "退场前说了句梦话，大家听完都被治愈了。"
  },
  {
    id: "r0yx1e", art: "assets/r0yx1e.jpg",
    name: "花发箍", title: "迎面的笑容",
    cost: 3, atk: 4, hp: 3,
    keywords: [],
    flavor: "发箍别好，花卡别正，今天也是元气满满的一天。"
  },
  {
    id: "shopassist", art: "assets/sh0p_ass1stant.jpg",
    name: "店员小人", title: "三笔画完",
    cost: 1, atk: 0, hp: 2,
    keywords: [], battlecry: { type: "draw", amount: 1 },
    flavor: "「欢迎光临～」顺手塞给你一张传单。"
  },
  {
    id: "xcate", art: "assets/xcate329.jpg",
    name: "银发徽章", title: "沉静的注视",
    cost: 6, atk: 5, hp: 7,
    keywords: ["taunt"],
    flavor: "她不说话，只是站在那里，谁也过不去。"
  },
  {
    id: "bakayuanyu", art: "assets/BAKA_Yuanyu.jpg",
    name: "无语小鸭", title: "一言难尽",
    cost: 2, atk: 3, hp: 2,
    keywords: [],
    flavor: "冷汗流下来，头顶的小鸭子替她把想说的话咽了回去。"
  },
  {
    id: "haige", art: "assets/HaigeSenmokkou.jpg",
    name: "呆住了", title: "顶着纸帽的瞬间",
    cost: 3, atk: 3, hp: 3,
    keywords: [], battlecry: { type: "freeze_random", amount: 1 },
    flavor: "她呆住了。看到她这个样子的人，也跟着呆住了。"
  },
  {
    id: "lostattr", art: "assets/LostAttractor.jpg",
    name: "星星魔女", title: "恋符全开",
    cost: 5, atk: 4, hp: 4,
    keywords: [], battlecry: { type: "damage_face", amount: 3 },
    flavor: "星星眼亮起来的时候，魔炮已经对准了你的脸。"
  },
  {
    id: "pasukalu", art: "assets/Pasukalu0.jpg",
    name: "小恶魔尖耳", title: "嘘——",
    cost: 4, atk: 4, hp: 4,
    keywords: ["lifesteal"],
    flavor: "指尖点在唇上，心形的瞳孔里映着你的血条。"
  },
  {
    id: "unnowen", art: "assets/UNN_Owen.jpg",
    name: "从容侧辫", title: "处变不惊",
    cost: 4, atk: 4, hp: 5,
    keywords: [],
    flavor: "不慌不忙把辫子捋到胸前，然后一拳把事情解决。"
  },
  {
    id: "julystratus", art: "assets/julystratus.jpg",
    name: "七月积云", title: "温柔的云层",
    cost: 2, atk: 1, hp: 4,
    keywords: ["taunt"],
    flavor: "像夏天的云一样拦在你面前，软软的，但过不去。"
  },
  {
    id: "moepig", art: "assets/moepigqwq.jpg",
    name: "睡猫团子", title: "越睡越大",
    cost: 2, atk: 1, hp: 2,
    keywords: ["grow"],
    flavor: "蜷成一团睡着了。每睡一觉，就悄悄长大一圈。"
  },
  {
    id: "huiliyi", art: "assets/real_huiliyi.jpg",
    name: "笑成一条线", title: "眯眯眼常开",
    cost: 1, atk: 1, hp: 3,
    keywords: [],
    flavor: "眼睛眯成两条线的人，心态一般都特别好。"
  },
  {
    id: "akari", art: "assets/saint_Akari.jpg",
    name: "就不做了", title: "睡大觉～",
    cost: 5, atk: 2, hp: 8,
    keywords: ["taunt"],
    flavor: "「就不做了，睡大觉～」裹紧被子，谁来都不好使。"
  },
  {
    id: "tcdwww", art: "assets/tcdwww.jpg",
    name: "抿嘴委屈", title: "一言不发",
    cost: 4, atk: 5, hp: 4,
    keywords: [],
    flavor: "她什么都没说，只是抿了抿嘴。然后出手很重。"
  },
  {
    id: "jom", art: "assets/jom123ab.jpg",
    name: "信使的道别", title: "抛向天空的信",
    cost: 3, atk: 2, hp: 5,
    keywords: [], battlecry: { type: "draw", amount: 1 },
    flavor: "信纸乘风而去，总有一封会落到你手上。"
  },
  {
    id: "inoueqd", art: "assets/inoueqd.jpg",
    name: "眼镜绅士", title: "可靠的大人",
    cost: 4, atk: 4, hp: 4,
    keywords: [],
    flavor: "西装笔挺，笑容和煦——评论区里少见的正装出席。"
  },
  {
    id: "yueli", art: "assets/yueliclaudius.jpg",
    name: "捂眼比心", title: "贤者系 Vtuber",
    cost: 3, atk: 3, hp: 3,
    keywords: [], battlecry: { type: "buff_random_ally", amount: 1 },
    flavor: "捂住一只眼，把画着爱心的那只手借给队友。"
  },
  {
    id: "nancy", art: "assets/Nancytihaya.jpg",
    name: "哇呀这是", title: "张开双臂冲过来",
    cost: 2, atk: 2, hp: 2,
    keywords: ["charge"],
    flavor: "「哇呀这是！」话没说完，人已经扑到面前了。"
  },
  {
    id: "seiran", art: "assets/Seiran____02.jpg",
    name: "星瞳女仆", title: "猫耳侍奉中",
    cost: 4, atk: 3, hp: 5,
    keywords: [], battlecry: { type: "heal_hero", amount: 2 },
    flavor: "眼里有星星的女仆小姐，端上来的红茶也闪闪发光。"
  },
  {
    id: "xiaodai", art: "assets/xiaodaichen_awa.jpg",
    name: "呆", title: "发呆传染中",
    cost: 2, atk: 1, hp: 3,
    keywords: [], battlecry: { type: "freeze_random", amount: 1 },
    flavor: "头顶一个'呆'字。看着看着，你也跟着呆住了。"
  },
  {
    id: "dzlwi", art: "assets/dzlwi.jpg",
    name: "冬之泪", title: "结冰的目光",
    cost: 4, atk: 3, hp: 5,
    keywords: [], battlecry: { type: "freeze_random", amount: 1 },
    flavor: "冬天的眼泪还没落地就结成了冰，落在谁身上谁就动不了。"
  },
  {
    id: "poca", art: "assets/Poca2381.jpg",
    name: "抛锚定泊", title: "托腮的惊喜",
    cost: 3, atk: 3, hp: 4,
    keywords: ["taunt"],
    flavor: "胸前的锚一落，这片海域就归她管了。"
  },
  {
    id: "juzi", art: "assets/juzi_you.jpg",
    name: "帽中魔女", title: "帽子里有猫耳",
    cost: 5, atk: 5, hp: 5,
    keywords: [],
    flavor: "宽大的魔女帽里藏着耳朵——藏得住耳朵，藏不住实力。"
  },
  {
    id: "bootjenna", art: "assets/BootJenna.jpg",
    name: "肉球拳", title: "pat pat",
    cost: 3, atk: 2, hp: 3,
    keywords: ["windfury"],
    flavor: "粉嫩的肉垫怼到镜头前——一回合拍你两下，不痛，但很痒。"
  },
];
