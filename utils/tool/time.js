// 距离开始时间
export function timeDiff(time) {
  // var str = "${DD}天${HH}小时${mm}分";

  var disTime = time - (new Date().getTime());
  var date = {};

  var DD_ = Math.floor(disTime / (24 * 60 * 60 * 1000));
  date.DD = DD_ < 10 ? '0' + DD_ : DD_;

  var li_1 = disTime % (24 * 3600 * 1000);
  var HH_ = Math.floor(li_1 / (3600 * 1000));
  date.HH = HH_ < 10 ? '0' + HH_ : HH_;

  var li_2 = li_1 % (3600 * 1000);
  var mm_ = Math.floor(li_2 / (60 * 1000));
  date.mm = mm_ < 10 ? '0' + mm_ : mm_;

  var str = "";

  if (date.DD != '00') {
    var str = `${date.DD}天${date.HH}时`;
  } else {
    var str = `${date.HH}时${date.mm}分`;
  }

  return str
}

// 分和秒显示
export function timeMMSS(time) {
  let str = '';


  let hh = Math.floor(time / 60)
  let ss = Math.floor(time % 60)


  let HH = hh < 10 ? '0' + hh : hh;
  let SS = ss < 10 ? '0' + ss : ss;

  return HH + ':' + SS
}
