const calc = Desmos.GraphingCalculator(document.getElementById('calc'),{graphpaper: true, keypad: false, settingsMenu: false,zoomButtons: false, border: false,showGrid: false, showResetButtonOnGraphpaper: true, clearIntoDegreeMode: true, fontSize: 16});

function callApi(){
const userInput = document.getElementById('userInput');
runAlgorithm(userInput);
}

function runAlgorithm(a){
    const userInput = a ;
    const string = userInput.value;
    
    fetch("https://nakdan-4-0.loadbalancer.dicta.org.il/api", {
    method: "POST",
    headers: {
      // authority: "nakdan-4-0.loadbalancer.dicta.org.il",

      "sec-ch-ua":
        '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
      "sec-ch-ua-platform": '"Windows"',
      "content-type": "text/plain;charset=UTF-8",
      // accept: "*/*",
      // origin: "https://nakdan.dicta.org.il",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      // referer: "https://nakdan.dicta.org.il/",
      "accept-language": "en-US,en;q=0.9",
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      task: "nakdan",
      data: string,
      // data: "היי מה שלומך",
      addmorph: true,
      keepqq: false,
      matchpartial: true,
      nodageshdefmem: false,
      patachma: false,
      keepmetagim: true,
      genre: "modern",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      dataSet = [];
      data.forEach((item) => {
        try {
          dataSet.push(item["options"][0][0]);
        } catch {}
      });
      console.log(dataSet.join(" "));
      const dictatedString = dataSet.join(" ");
      const spreadArray = [...dictatedString];
      console.log(spreadArray);
      const listOfNumbers =  numList(spreadArray);
      const xyarrays = twoArrays(listOfNumbers);
      console.log(xyarrays[1]); 
    
      createPolygon(xyarrays[0],xyarrays[1]);
     
    });
    }
          
   
function numList(a){
const usingSpread = a;
const arrNum=[];
var temp;
for (let i = 0; i < usingSpread.length; i++) { // run on all string
 
  if(usingSpread[i].charCodeAt(0)> 1487 && usingSpread[i].charCodeAt(0)< 1515 ){//if isletter=true --> push to array
   temp = (((usingSpread[i].charCodeAt(0))-1515)*-1 )// ת = 27 ,  1=א
    console.log(temp);
    arrNum.push(temp);
    } else{// if not letter than it's a nikud
      
          if(usingSpread[i].charCodeAt(0)== 32){
           arrNum.push(32);
          }
   
          if(usingSpread[i].charCodeAt(0)== 1460){// if חיריק, add 1
            arrNum.push(41);
           }
   
          if(usingSpread[i].charCodeAt(0)> 1455 && usingSpread[i].charCodeAt(0)<1463){// if ae, add 2
            arrNum.push(42);
           }
      
          if(usingSpread[i].charCodeAt(0)> 1462 && usingSpread[i].charCodeAt(0)<1465){// if פתח,קמץ add 5
            arrNum.push(45);
            } 
      
          if(usingSpread[i].charCodeAt(0)> 1466 && usingSpread[i].charCodeAt(0)<1469){// if שורוק add 3
            arrNum.push(43);
            } 
      
           if(usingSpread[i].charCodeAt(0)> 1466 && usingSpread[i].charCodeAt(0)<1469){// if ֺx add 4
            arrNum.push(44);
            } 
      
          if(usingSpread[i].charCodeAt(0)== 1468 || usingSpread[i].charCodeAt(0)== 1465){//if nikud special just add the real ASCII value.
           arrNum.push(usingSpread[i].charCodeAt(0));
            }
    }
  
    }
        arrNum.push(33); // הוספתי את ה33 לסוף המשפט בעיקר כדי להבדיל אותו מרווחים אחרים בטקסט
            console.log(arrNum);
        return arrNum; 
}//end numList

function twoArrays(a){
const ArrX = [];
const ArrY = [];
const arrNum = a;
for (let i = 1; i < arrNum.length; i++) {
  
      if (arrNum[i] == 33) {//סוף משפט
        
         if(arrNum[i-1] < 28 && arrNum[i-1] > 0){ //  סוף משפט שמגיע אחרי אות 
            ArrX.push(arrNum[i-1]);
            ArrY.push(0);
        
          } 
            else { 
         if (arrNum[i] == 33 && arrNum[i-1] >=40 && arrNum[i-1] <50){} // סוף משפט וסיימתי בניקודDo nothing.
       }
     }  //סוף משפט  
          
  
  
      if (arrNum[i] == 32){// סוף מילה 
        
        if(arrNum[i-1] < 28 && arrNum[i-1] > 0){// סוף מילה שמגיעה אחרי אות
        
             ArrX.push(arrNum[i-1]);
             ArrY.push(0);
             ArrX.push(999);// 999 == isEndOfWord=Ture, isEndOfSentence=False
             ArrY.push(999);// 999 == isEndOfWord=Ture, isEndOfSentence=False
            }else{
        if ( arrNum[i-1] < 50 && arrNum[i-1] >= 40 ||arrNum[i-1] == 22 || arrNum[i-1] == 1465 ){//  סוף מילה שמגיעה אחרי ניקוד רגיל\ניקוד מיוחד
       
             ArrX.push(999);// end of word
             ArrY.push(999);// end of word
            }     
          
            }
      }//סוף מילה 
             
     if (arrNum[i]==1465 || arrNum[i]==1468) {
         
     if(arrNum[i-1]==22 && arrNum[i-2]<28 && arrNum[i-2]>0){//אני עומד על ניקוד מיוחד, לפניו מגיעה האות ו', ולפניהם מגיעה אות לא מנוקדת
       if(arrNum[i]==1465){
             ArrX.push(arrNum[i-1]);
             ArrY.push(4);}       
       if(arrNum[i]==1468){
             ArrX.push(arrNum[i-1]);
             ArrY.push(3);}
    
            }}// סוף מיוחדים 
     /*        
    if(arrNum[i]<28 && arrNum[i] > 0 && arrNum[i-1]<28 && arrNum[i-1] > 0 ){// עומד על אות ולפניי אות לא מנוקדת
      ArrX.push(arrNum[i-1]);
      ArrY.push(0);
    }// סוף עומד על אות
  
 */


    if(arrNum[i-1]<28 && arrNum[i-1] > 0 && arrNum[i]<50 && arrNum[i] >=40 && arrNum[i-1]!=22){//עומד על ניקוד ולפני אות שהיא לא ו'
      ArrX.push(arrNum[i-1]);
      ArrY.push(arrNum[i]-40);}
  
  
}// end for

console.log(ArrX);
console.log(ArrY);
var temp1='['; 
const points = [];
const ids =[];
var counter = 1; 

if(ArrX.length != ArrY.length){
 
  console.log("Error, Arrays are not in the same length");
}else{

for(let i = 0; i < ArrX.length; i++){
  if(ArrX[i]!=999 && ArrY[i]!=999 && ArrY[i]!=33){
   temp1= temp1.concat('('+ArrX[i]+','+ArrY[i]+')'+',');
   console.log(temp1);
  }else{ if (ArrX[i]==999 && ArrY[i]== 999){
    temp1 = temp1.slice(0, -1);
    temp1 = temp1.concat(']');
     console.log(temp1);
    points.push(temp1);
    temp1 = '[' ;
    ids.push('P_'+ counter);
    counter = counter +1 ;
  } 
   
  }
 }
temp1 = temp1.slice(0, -1);
    temp1 = temp1.concat(']');
     console.log(temp1);
    points.push(temp1);
    temp1 = '[' ;
    ids.push('P_'+ counter);
    counter = counter +1 ;
  console.log(points);
console.log(ids);

}
return [ids,points] ; 

}

function createPolygon(array1,array2){
  
  const ids = array1;
const point = array2;
 const string1 =[];
 var i=0;
 while(i<ids.length){
 string1.push({ identifier: ids[i] , points: point[i] }) ;
 i=i+1;
 }
 
 
 
 
 const polygons = string1;
 
 for (let i = 0; i < polygons.length; i++) {
   const { identifier, points } = polygons[i];
   
   calc.setExpressions([
      
     { id: `list${i}`, latex: `${identifier}=${points}`, pointSize:'2'},
     { id: `poly${i}`, latex: `\\operatorname{polygon}\\left(${identifier}\\right)`, color: '#000000', fillOpacity: '0.08', lineWidth: '1'}
   ])
 }
 calc.updateSettings({ color: Desmos.Colors.BLACK });
}


/*   {
        id: 'POINT',
        latex: '(1,0)',
        showLabel: true,
        color: Desmos.Colors.BLACK},*/ 