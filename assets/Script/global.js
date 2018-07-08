/**
 * Created by tangwen on 2018/2/26.
 */
const global = {};
module.exports = global;


function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      // break;
    }
  }
}

global.removeByValue = removeByValue;

// 禁用log
// cc.log = function () {
	
// }


export default global;
