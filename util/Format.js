const useFormat = (data) => {
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
            if (amUploads && amUploads[0].data.length!=0){
                formattedData[formattedData.length] = amUploads; 
            }
            if(pmUploads && pmUploads[0].data.length!=0){
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
