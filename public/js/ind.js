
console.log('start my site!')
const but_reqChange = document.getElementById('reqChange')
const but_nextItem = document.getElementById('nextItem')
const but_joinerWords = document.getElementById('joinerWords')

let linamear = document.getElementsByClassName('liname');
let namear = document.getElementsByClassName('name');
console.log(namear)

let lifindar = document.getElementsByClassName('lifind')
let findar = document.getElementsByClassName('find')
let workText = document.getElementById('workText')


let ligroupar = document.getElementsByClassName('ligroup');
let groupar = document.getElementsByClassName('group')

let thisname
let thisfind
let thisgroup

let index = 0;
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
    but_reqChange.onclick()
});


but_nextItem.onclick = () => {
    index++
    if(index)
    displCurrentData()
    but_reqChange.onclick()
}
but_reqChange.onclick = function () {
    thisname = document.getElementById('nameid'+index);
    thisfind = document.getElementById('findid'+index);
    thisgroup = document.getElementById('groupid'+index);

    
    let thisNameValue = thisname.value;
    let thisFindValue = thisfind.value;
    let thisGroupValue = thisgroup.value;

    thisfind.value = `${thisNameValue} ${thisFindValue} ${thisGroupValue}`
    // Удаление знаков препинания:
    //оставить скобки () и дефис -
    thisfind.value = thisfind.value.replace(/[\.,\/#!$%\^&\*;:{}=\_`~@\+\?><\[\]\+]/g, '')
    ////без скобок () и дефиса -
    // thisfind.value = thisfind.value.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')
    
    //замена дефиса "-" на пробел
    thisfind.value = thisfind.value.replace(/-/g, ' ');
    
    // Перевод всех букв в нижний регистр
    thisfind.value = thisfind.value.toLowerCase()
    workText.value = thisfind.value



    // index++
    if(index>linamear.length-1) but_find.disabled = true
}
but_joinerWords.onclick = () => {
        let subs = thisfind.value.substring(thisfind.selectionStart, thisfind.selectionEnd);
        subs = subs.split(' ').join('&nbsp;');
        workText.value = thisfind.value.substring(0, thisfind.selectionStart) + 
        subs +
        thisfind.value.substring(thisfind.selectionEnd, thisfind.length);
}


