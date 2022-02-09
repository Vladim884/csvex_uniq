
console.log('start my site!')
const but_firstReqChange = document.getElementById('reqChange')
const but_nextItem = document.getElementById('nextItem')
const but_joinerWords = document.getElementById('joinerWords')
const but_mainPhrase = document.getElementById('mainPhrase')

let linamear = document.getElementsByClassName('liname');
let namear = document.getElementsByClassName('name');
console.log(namear)

let lifindar = document.getElementsByClassName('lifind')
let findar = document.getElementsByClassName('find')
let groupFindReq1 = document.getElementById('group1')
let mainPhrase1 = document.getElementById('mainphrase')


let ligroupar = document.getElementsByClassName('ligroup');
let groupar = document.getElementsByClassName('group')

let thisname
let thisfind
let thisgroup

let index = 0;


but_firstReqChange.onclick = () => {
    groupFindReq1.value = groupFindReq1.value.trim()// строка поисковых запросов
    mainPhrase1.value = mainPhrase1.value.trim()// строка главной фразы №1
    let arrFindReq = groupFindReq1.value.split(" ") // перевод строки group1 в массив с разделителем " "
    let arMainPhr = mainPhrase1.value.split(" ") // перевод строки mainPhrase в массив с разделителем " "
    for (let i = 0; i < arrFindReq.length; i++) { // удаление одинаковых слов из mainPhrase в group1  
        if (arrFindReq[i] === arMainPhr[0] || arrFindReq[i] === arMainPhr[1]) {
            arrFindReq.splice(i, 1) // full deleting from arrey
        }
    }
    alert(arrFindReq)
    console.log(arrFindReq)

    let str1 = `${mainPhrase1.value}, ${arMainPhr[1]} ${arMainPhr[0]}, `
    console.log(`str1: ${str1}`)
    alert(str1)
    for (let i = 0; i < arrFindReq.length; i++) {
        str1 += `${arMainPhr[0]} ${arrFindReq[i]}, ${arrFindReq[i]} ${arMainPhr[0]}, `
        str1 += `${arMainPhr[0]} ${arMainPhr[1]} ${arrFindReq[i]}, `
        str1 += `${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i]}, `
        str1 += `${arMainPhr[0]}  ${arrFindReq[i]} ${arMainPhr[1]}, `
        if(arrFindReq[i+1]){
            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i]} ${arrFindReq[i+1]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]}  ${arMainPhr[1]} ${arrFindReq[i+1]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+1]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+1]}, `    
        }
        if(arrFindReq[i+2]){
            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i]} ${arrFindReq[i+2]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]}  ${arMainPhr[1]} ${arrFindReq[i+2]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+2]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+2]}, `
            
            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i+1]} ${arrFindReq[i+2]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+1]}  ${arMainPhr[1]} ${arrFindReq[i+2]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+1]} ${arrFindReq[i+2]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i+1]} ${arrFindReq[i+2]}, `
        }
        if(arrFindReq[i+3]) {
            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]}  ${arMainPhr[1]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+3]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i]} ${arrFindReq[i+3]}, `

            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i+1]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+1]}  ${arMainPhr[1]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+1]} ${arrFindReq[i+3]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i+1]} ${arrFindReq[i+3]}, `

            str1 += `${arMainPhr[0]}  ${arMainPhr[1]} ${arrFindReq[i+2]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+2]}  ${arMainPhr[1]} ${arrFindReq[i+3]}, `    
            str1 += `${arMainPhr[0]} ${arrFindReq[i+2]} ${arrFindReq[i+3]}  ${arMainPhr[1]}, `    
            str1 += ` ${arMainPhr[1]} ${arMainPhr[0]} ${arrFindReq[i+2]} ${arrFindReq[i+3]}, `
        }
           
    }
    alert(str1)
    console.log(str1)
}
function displCurrentData() {
    for (let i = 0; i < linamear.length; i++) {
        if(index === linamear.length){
            // index = 0
            // return
            but_nextItem. disabled = true
        }
        if(i!=index){
            linamear[i].classList.add('hidden')
            lifindar[i].classList.add('hidden');
            ligroupar[i].classList.add('hidden');
        }
        linamear[index].classList.remove('hidden');
        lifindar[index].classList.remove('hidden');
        ligroupar[index].classList.remove('hidden');
            

        namear[i].id = 'nameid' + i;
        findar[i].id = 'findid' + i;
        groupar[i].id = 'groupid' + i;

        // divText.innerHTML = findar[i].value

        console.log('ok');
    }
}
document.addEventListener('DOMContentLoaded', function(){
    displCurrentData()
    initialReqChange()
});


but_nextItem.onclick = () => {
    index++
    if(index)
    displCurrentData()
    initialReqChange()
    mainPhrase1.value = ''
}
const initialReqChange = function () {
    thisname = document.getElementById('nameid'+index);
    thisfind = document.getElementById('findid'+index);
    thisgroup = document.getElementById('groupid'+index);

    
    let thisNameValue = thisname.value;
    let thisFindValue = thisfind.value;
    let thisGroupValue = thisgroup.value;

    groupFindReq1.value = `${thisNameValue}`
    groupFindReq1.value = thisNameValue
    // thisfind.value = `${thisNameValue} ${thisFindValue} ${thisGroupValue}`

    // Удаление знаков препинания:
    //оставить скобки () и дефис -
    groupFindReq1.value = groupFindReq1.value.replace(/[\.,\/#!$%\^&\*;:{}=\_`~@\+\?><\[\]\+]/g, '')
    ////без скобок () и дефиса -
    // thisfind.value = thisfind.value.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')
    
    //замена дефиса "-" на пробел
    groupFindReq1.value = groupFindReq1.value.replace(/-/g, ' ');
    
    // Перевод всех букв в нижний регистр
    groupFindReq1.value = groupFindReq1.value.toLowerCase()

    if(index>linamear.length-1) but_find.disabled = true
}
but_joinerWords.onclick = () => {
        let subs = groupFindReq1.value.substring(groupFindReq1.selectionStart, groupFindReq1.selectionEnd);
        // subs = subs.split(' ').join('&nbsp;')
        subs = subs.split(' ').join('_')
        groupFindReq1.value = groupFindReq1.value.substring(0, groupFindReq1.selectionStart) + 
        subs +
        groupFindReq1.value.substring(groupFindReq1.selectionEnd, groupFindReq1.length);
}

but_mainPhrase.onclick = () => {
    let subs = groupFindReq1.value.substring(groupFindReq1.selectionStart, groupFindReq1.selectionEnd);
    // subs = subs.split(' ').join('&nbsp;')
    subs = subs.split(' ')
    alert(subs)
    mainPhrase1.value = `${subs[0]} ${subs[subs.length-1]}`
}






