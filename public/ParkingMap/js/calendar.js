var timeline = document.getElementsByClassName("timeline")[0]
var date = new Date();
var thisYear = date.getFullYear();  //getFullYear()代替getYear()
var thisMonth = date.getMonth() + 1;//月 getMonth()：0 ~ 11
// var day = date.getDate();//日 getDate()：(1 ~ 31)
let today = date.getDate();
let hour = date.getHours();
let date_label = document.getElementsByClassName('date');
let thisHour = document.getElementById('hourPicker')
thisHour.value = Number(date.getHours())
date_label[0].innerHTML = thisYear + "年 " + addZero(thisMonth) + "月" + addZero(today) + "日" + addZero(thisHour.value) + "时";
clearParkMarker();
getData()
// console.log(date.getHours())

showFlag = 0;
function showTime() {
    let calendar = document.getElementsByClassName("xs-date");
    if (!showFlag) {
        calendar[0].style.display = 'block';
        // console.log(time);
        showFlag = !showFlag;
    }
    else {
        calendar[0].style.display = 'none';
        console.log(time);
        showFlag = !showFlag;
    }
}
var time;

let date_time = document.querySelector(".date-time");
let prev = document.querySelector(".date-prev");
let next = document.querySelector(".date-next");
let prev_year = document.querySelector(".date-year-prev");
let next_year = document.querySelector(".date-year-next");
let date_day = document.querySelector(".xs-date-day");

// 初始

let year;
let month;
let day;
function updateTime() {
    year = date.getFullYear(); //当前年份
    month = date.getMonth() + 1; //当前月 
    day = date.getDate(); //当前天 
    time = year + '-' + month + '-' + day;
    // console.log(time);
    date_day.innerHTML = "";
    date_time.innerText = year + "年 " + addZero(month) + "月"; //标题时间

    var setDate = new Date(year, month, 0);
    var setDay = setDate.getDate(); //这个月天数
    var setWeek = new Date(year, month - 1, 1).getDay(); //上个月星期几
    var setDayEM = new Date(year, month - 1, 0).getDate(); //上个月天数

    //渲染上个月星期
    setWeek <= 0 ? setWeek = 7 : setWeek;
    for (let i = (setDayEM - setWeek) + 1; i <= setDayEM; i++) {
        let EmptyDiv = document.createElement('div');
        EmptyDiv.innerText = i;
        EmptyDiv.className = "Disable";
        EmptyDiv.style.cursor = "default";
        date_day.appendChild(EmptyDiv);
    }
    // 渲染日期
    if (year != thisYear || month != thisMonth) {
        for (let i = 1; i <= setDay; i++) {
            let TimeDiv = document.createElement('div');
            TimeDiv.innerText = i;
            TimeDiv.className = "item-time";
            if (i == day) {
                TimeDiv.classList.add("active");
            }
            date_day.appendChild(TimeDiv);
        }
    }
    else if(year == thisYear && month == thisMonth && (day <= today || day == today + 1)){
        for (let i = 1; i <= setDay; i++) {
            let TimeDiv = document.createElement('div');
            TimeDiv.innerText = i;
            TimeDiv.className = "item-time";
            if (i == day) {
                TimeDiv.classList.add("active");
                date_day.appendChild(TimeDiv);
            }
            else if (i < day) {
                date_day.appendChild(TimeDiv);
            }
            else if (i > day && i <= today) {
                date_day.appendChild(TimeDiv);
            }
            else if (i > today) {
                let DisDiv = document.createElement('div');
                DisDiv.innerText = i;
                DisDiv.className = "Disable";
                DisDiv.style.cursor = "default";
                date_day.appendChild(DisDiv);
            }
        }
    }
    else if(year == thisYear && month == thisMonth && day == today){
        for (let i = 1; i <= setDay; i++) {
            let TimeDiv = document.createElement('div');
            TimeDiv.innerText = i;
            TimeDiv.className = "item-time";
            if (i == today) {
                TimeDiv.classList.add("active");
                date_day.appendChild(TimeDiv);
            }
            else if (i < today) {
                date_day.appendChild(TimeDiv);
            }
            else if (i > today) {
                let DisDiv = document.createElement('div');
                DisDiv.innerText = i;
                DisDiv.className = "Disable";
                DisDiv.style.cursor = "default";
                date_day.appendChild(DisDiv);
            }
        }
    }
    else if(year == thisYear && month == thisMonth && day > today + 1){
        day = today;
        for (let i = 1; i <= setDay; i++) {
            let TimeDiv = document.createElement('div');
            TimeDiv.innerText = i;
            TimeDiv.className = "item-time";
            if (i == today) {
                TimeDiv.classList.add("active");
                date_day.appendChild(TimeDiv);
            }
            else if (i < today) {
                date_day.appendChild(TimeDiv);
            }
            else if (i > today) {
                let DisDiv = document.createElement('div');
                DisDiv.innerText = i;
                DisDiv.className = "Disable";
                DisDiv.style.cursor = "default";
                date_day.appendChild(DisDiv);
            }
        }
    }
    // 渲染尾部
    for (let i = 1; i <= (42 - setWeek - setDay); i++) {
        let DisDiv = document.createElement('div');
        DisDiv.innerText = i;
        DisDiv.className = "Disable";
        DisDiv.style.cursor = "default";
        date_day.appendChild(DisDiv);
    }
    itemClick(year, month);
}

updateTime();

prev.onclick = function () {
    date.setMonth(month - 2);
    date.setDate(day);
    updateTime();
    // let setedTime = setTime(year, month, day, seletedHour);
    // console.log(setedTime[0] + ',' + setedTime[1]);
    // getNoise(setedTime[0], setedTime[1]);
    date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
    if (!(year == thisYear && month == thisMonth)) {
        next.classList.add('color');
        next.classList.remove('defaultCursor');
    }
    else {
        next.classList.remove('color');
        next.classList.add('defaultCursor');
}
    if (year < thisYear) {
        next_year.classList.add('color');
        next_year.classList.remove('defaultCursor');
    }
    else {
        next_year.classList.remove('color');
        next_year.classList.add('defaultCursor');
    }
};
next.onclick = function () {
    if (!(year == thisYear && month == thisMonth)) {
        date.setMonth(month );
        date.setDate(day);
        updateTime();
        // let setedTime = setTime(year, month, day, seletedHour);
        // console.log(setedTime[0] + ',' + setedTime[1]);       
        // getNoise(setedTime[0], setedTime[1]);
        date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
        if (!(year == thisYear && month == thisMonth)) {
            this.classList.add('color');
            this.classList.remove('defaultCursor');
        }
        else {
            this.classList.remove('color');
            this.classList.add('defaultCursor');
        }
        if(year == thisYear){
            next_year.classList.remove('color');
            next_year.classList.add('defaultCursor');
        }
        if ((year == thisYear && month == thisMonth && today == day)) {
            thisHour.value = hour
            date_label[0].innerHTML = thisYear + "年 " + addZero(thisMonth) + "月" + addZero(today) + "日" + addZero(thisHour.value) + "时";
            let scrollw = scroll.offsetWidth;
            ball.style.left = scrollw / 10 - 10 + "px";
        }
    }
};
prev_year.onclick = function () {
    date.setYear(date.getFullYear() - 1);
    date.setDate(day);
    updateTime();
    // let setedTime = setTime(year, month, day, seletedHour);
    // console.log(setedTime[0] + ',' + setedTime[1]);
    // getNoise(setedTime[0], setedTime[1]);
    date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
    if (year < thisYear) {
        next_year.classList.add('color');
        next_year.classList.remove('defaultCursor');
    }
    else {
        next_year.classList.remove('color');
        next_year.classList.add('defaultCursor');
    }
    next.classList.add('color');
    next.classList.remove('defaultCursor');
};
next_year.onclick = function () {
    if ( (year < thisYear - 1) || (year == thisYear - 1 && month <= thisMonth)) {
        date.setYear(date.getFullYear() + 1);
        date.setDate(day);
        updateTime();
        // let setedTime = setTime(year, month, day, seletedHour);
        // console.log(setedTime[0] + ',' + setedTime[1]);
        // getNoise(setedTime[0], setedTime[1]);
        date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
        if (year < thisYear) {
            this.classList.add('color');
            this.classList.remove('defaultCursor');
        }
        else if(year == thisYear && month == thisMonth){
            this.classList.remove('color');
            this.classList.add('defaultCursor');
            next.classList.remove('color');
            next.classList.add('defaultCursor');
        }
        else {
            this.classList.remove('color');
            this.classList.add('defaultCursor');
        }
    }
    else if(year == thisYear - 1 && month > thisMonth){
        date.setYear(date.getFullYear() + 1);
        date.setMonth(thisMonth - 1);
        date.setDate(today);
        updateTime();
        // let setedTime = setTime(year, month, day, seletedHour);
        // console.log(setedTime[0] + ',' + setedTime[1]);
        // getNoise(setedTime[0], setedTime[1]);
        date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
        this.classList.remove('color');
        this.classList.add('defaultCursor');
        next.classList.remove('color');
        next.classList.add('defaultCursor');
    }
    if ((year == thisYear && month == thisMonth && today == day)) {
        thisHour.value = hour
        date_label[0].innerHTML = thisYear + "年 " + addZero(thisMonth) + "月" + addZero(today) + "日" + addZero(thisHour.value) + "时";
        let scrollw = scroll.offsetWidth;
        ball.style.left = scrollw / 10 - 10 + "px";
    }
};

function itemClick(year, month) {
    let item_time = document.querySelectorAll(".item-time");
    for (let i = 0; i < item_time.length; i++) {
        item_time[i].onclick = function () {
            for (let i = 0; i < item_time.length; i++) {
                item_time[i].classList.remove("active");
            }
            this.classList.add("active");
            day = addZero(this.innerText);
            time = year + "-" + month + "-" + day;
            console.log(time);//获取日期
            date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + day + "日" + addZero(thisHour.value) + "时";
            // let setedTime = setTime(year, month, day, seletedHour);
            // console.log(setedTime[0] + ',' + setedTime[1]);           
            // getNoise(setedTime[0], setedTime[1]);
        }
    }
    if (!(year == thisYear && month == thisMonth && today == day)) {
        scroll.style.display = "none";
        timeline.style.display = "none";
    }
    else {
        scroll.style.display = "block";
        timeline.style.display = "flex";
    }
}

function minus() {
    thisHour.value -= 1
    if (thisHour.value < 0) thisHour.value = 0
}

function plus() {
    var year = date.getFullYear(); //当前年份
    var month = date.getMonth() + 1; //当前月 
    var day = date.getDate(); //当前天 
    var hour = date.getHours()
    console.log(thisYear,year,thisMonth,month,today,day,parseInt(thisHour.value),hour)
    if (!(thisYear == year && thisMonth == month && today == day)) {
        //  && 
        thisHour.value = parseInt(thisHour.value) + 1;
    }
    else if (parseInt(thisHour.value) < hour + 4) {
        thisHour.value = parseInt(thisHour.value) + 1;

    }
    if (thisHour.value > 23) thisHour.value = 23
}

function addZero(s) {
    s = parseInt(s)
    return s < 10 ? ('0' + s) : s;
}

function comfirm() {
    console.log(thisHour.value)
    date_label[0].innerHTML = year + "年 " + addZero(month) + "月" + addZero(day) + "日" + addZero(thisHour.value) + "时";
    clearParkMarker();
    getData()
}