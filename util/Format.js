/*
format for section list
  DATA = [
      {
          title: time of day
          data: [key1,key2,key3...]
      }
      .
      .
      .
  ]
  format for n list for section list
  [[{}...],[{}...],[{}...]...]

 we now need look up table for keyi
 its structure is as follows

 {
     key: key
     value: value
     .
     .
     .
 }
 creating ->
    const map = new Map()
    map.set(key,value)
 merging ->
    const table = pmMap.forEach((key,value)=>{
        amMap.set(value,key);
    });
 accessing -> 
   map.get(key) returns value
*/


const useFormat = (data) => {
    /*
      format for n list for section list
      [[{string,[]}...],[{string,[]}...],[{string,[]}...]...]
    */
    function formatedData(array,time){
        const map = new Map();
        var data = {};
        data.title = time;
        data.data = [];
        for(var i in array){
          const path = array[i];
          var key = path.substring(path.lastIndexOf("/"),path.length).replace("/","").replace(".mp4","");
          key = key.indexOf('0')!=0 ? key : key.replace('0','');
          data.data[i] = key;
          map.set(key,path);
        }
        return [[data],map];
    }
    function getSectionListData(data){
        if(data.Contents){
            let array = data.Contents.map(element => element.Key);
            let amArray = array.filter(key => key.includes("am"));
            let pmArray = array.filter(key => key.includes("pm"));
            const [amUploads,amMap] = formatedData(amArray,"Day");
            const [pmUploads,pmMap] = formatedData(pmArray,"Night");
            pmMap.forEach((key,value)=>{
                amMap.set(value,key);
            });
            var formattedData = [];
            if (amUploads && amUploads.length!=0){
                formattedData[formattedData.length] = amUploads; 
            }
            if(pmUploads && pmUploads.length!=0){
                formattedData[formattedData.length] = pmUploads; 
            }
            return [formattedData,amMap];
            
    
        }else{
            return [];
        }
    }
    
    return getSectionListData(data);
}
export default useFormat;
/*
    function getFormatedData(array){
        var data = [];
        for(var i in array){
          const path = array[i];
          var dict = {};
          var key = path.substring(path.lastIndexOf("/"),path.length).replace("/","").replace(".mp4","");
          key = key.indexOf('0')!=0 ? key : key.replace('0','');
          dict["key"] = key;
          dict["value"] = path;
          data[i] = dict;
        }
        return data;
    }

    function setUploadDictionaries(data){
        const [datas,table] = getSectionListData(data);
        console.log(datas,table);
        if(data.Contents){
            let array = data.Contents.map(element => element.Key);
            let amArray = array.filter(key => key.includes("am"));
            let pmArray = array.filter(key => key.includes("pm"));
            const amUploads = getFormatedData(amArray);
            const pmUploads = getFormatedData(pmArray);
            var data = {};
            data.lists = [];      
            if (amUploads && amUploads.length!=0){
                data.lists[data.lists.length] = amUploads; 
            }
            if(pmUploads && pmUploads.length!=0){
                data.lists[data.lists.length] = pmUploads;
            }
            return data;
        }else{
            return {};
        }
    }
*/