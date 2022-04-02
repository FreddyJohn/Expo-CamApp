


const useFormat = (data) => {
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
    return setUploadDictionaries(data);
}
export default useFormat;
