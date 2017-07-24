function getAirPlane(data){
  
  var resArray = [];
  var newArry = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];

  for(let i=0;i<newArry.length;i++){
    var newObj = {};
    var resAirPort = [];
     for(let j=0;j<data.length;j++){
  if (newArry[i] == data[j].PinyinFirst.substring(0, 1)) {
        resAirPort.push(data[j]);
        newObj["first"] = newArry[i];
       }  
     }
     newObj["airport"] = resAirPort;
     resArray.push(newObj);

  }
  return resArray;
}
module.exports={
  airPorts: getAirPlane
}