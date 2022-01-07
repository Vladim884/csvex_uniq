
console.log('start my site!')
const but_find = document.getElementById('find');

let linamear = document.getElementsByClassName('liname');
let namear = document.getElementsByClassName('name');
console.log(namear)

let lifindar = document.getElementsByClassName('lifind');
let findar = document.getElementsByClassName('find');


let ligroupar = document.getElementsByClassName('ligroup');
let groupar = document.getElementsByClassName('group');



document.addEventListener('DOMContentLoaded', function(){

    
    
    for (let i = 0; i < linamear.length; i++) {
        if(i>0){
            linamear[i].classList.add('hidden');
            lifindar[i].classList.add('hidden');
            ligroupar[i].classList.add('hidden');
        }
        namear[i].id = 'nameid' + i;
        findar[i].id = 'findid' + i;
        groupar[i].id = 'groupid' + i;

        console.log('ok');
    }
});

let index = 0;
but_find.onclick = function () {
    // console.log(index);
    
    // let liarr = document.getElementsByTagName('li');
    

    if(index>0) {
        linamear[index-1].classList.add('hidden');
        lifindar[index-1].classList.add('hidden');
        ligroupar[index-1].classList.add('hidden');
        linamear[index].classList.toggle('hidden');
        lifindar[index].classList.toggle('hidden');
        ligroupar[index].classList.toggle('hidden');
    }
    let thisname = document.getElementById('nameid'+index);
    let thisfind = document.getElementById('findid'+index);
    let thisgroup = document.getElementById('groupid'+index);

    thisname.value = 'new name';
    thisfind.value = 'new find-request';
    thisgroup.value = 'new group-name';

    index++;
    if(index>linamear.length-1) but_find.disabled = true;
}
