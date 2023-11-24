var map = new BMapGL.Map('container', {
    enableRotate: false,
    enableTilt: false
});

map.addEventListener('load', function () {
    window.parent.postMessage({ type: 'MAP_LOADED' }, '*');
});

// 设置地图样式、中心点和缩放级别等
map.setMapStyleV2({ styleId: '496884aa579a11e1ea5b693073c9e635' });
map.centerAndZoom(new BMapGL.Point(119.26276194849366, 26.047113730309484), 16); // 默认中心
map.enableScrollWheelZoom();
var locationCtrl = new BMapGL.LocationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
map.addControl(locationCtrl);

var timelineDate = new Date();
hours = timelineDate.getHours()
minutes = timelineDate.getMinutes()

var time = document.getElementsByClassName("time")

time[0].innerText = addZero(hours % 24) + ':00';
time[1].innerText = addZero((hours + 1) % 24) + ':00';
time[2].innerText = addZero((hours + 2) % 24) + ':00';
time[3].innerText = addZero((hours + 3) % 24) + ':00';
time[4].innerText = addZero((hours + 4) % 24) + ':00';

var infoWindows = []
var markers = []


window.addEventListener("message", receiveMessage, false);

// 接收来自Vue的数据
function receiveMessage(event) {
    if (event.data.type && (event.data.type === "CONGESTION_DATA_RECEIVED")) {
        console.log("JS接收到的停车数据:", event.data.data);
        // 延迟处理数据，确保地图加载顺利
        setTimeout(function () {
            processData(event.data.data);
        }, 5000);
    }
}

function getData() {
    var showtime = document.getElementsByClassName("date")[0].innerHTML
    var parkTime = showtime.slice(0, 4) + "-" + showtime.slice(6, 8) + "-" + showtime.slice(9, 11) + "T" + showtime.slice(12, 14) + ":00"

    // 后端请求移入vue，方便统一管理
    window.parent.postMessage({ type: "GET_CONGESTION_DATA", time: parkTime }, "*");
}

function processData(data) {
    console.log("开始处理数据");
    var obj = [];
    for (let i = 0; i < data.length; i++) {
        obj.push({
            number: data[i].value,
            coordinate: [[data[i].roadCoordinate[0].longitude, data[i].roadCoordinate[0].latitude], [data[i].roadCoordinate[1].longitude, data[i].roadCoordinate[1].latitude]],
            center: [(data[i].roadCoordinate[0].longitude + data[i].roadCoordinate[1].longitude) / 2, (data[i].roadCoordinate[0].latitude + data[i].roadCoordinate[1].latitude) / 2]
        });

    }
    console.log(obj);

    for (let i = 0; i < obj.length; i++) {
        // console.log(obj);
        var parkIcon = new BMapGL.Icon("/src/park.png", new BMapGL.Size(30, 75));
        var n = 0
        var recommend = 0
        if (obj[i].number <= 5) n = 3;
        else if (obj[i].number <= 10) n = 2;
        else if (obj[i].number <= 15) n = 1;
        else if (obj[i].number > 15) n = 0;
        if (obj[i].number > 20) {
            var marker = new BMapGL.Marker(new BMapGL.Point(obj[i].center[0], obj[i].center[1]), { icon: parkIcon });
            markers.push(marker)
            map.addOverlay(marker)
        }
        switch (n) {
            case 0: var color = { strokeColor: "rgb(166, 244, 125)", strokeWeight: 5, strokeOpacity: 1 }; break;
            case 1: var color = { strokeColor: 'rgb(240, 206, 96)', strokeWeight: 5, strokeOpacity: 1 }; break;
            case 2: var color = { strokeColor: 'rgb(228, 152, 76)', strokeWeight: 5, strokeOpacity: 1 }; break;
            case 3: var color = { strokeColor: 'rgb(215, 68, 50)', strokeWeight: 5, strokeOpacity: 1 }; break;
        }
        var polyline = new BMapGL.Polyline(
            [new BMapGL.Point(obj[i].coordinate[0][0], obj[i].coordinate[0][1]), new BMapGL.Point(obj[i].coordinate[1][0], obj[i].coordinate[1][1])],
            color
        )
        map.addOverlay(polyline);
        polyline.addEventListener('click', function (e) {
            // 获取用户当前坐标
            var geoc = new BMapGL.Geocoder();
            var pt = e.latLng;
            geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                // 创建信息窗口
                var title = addComp.street
                var point = new BMapGL.Point(e.latLng.lng, e.latLng.lat);
                var opts = {
                    width: 230,
                    height: 30,
                    title: title
                };
                var infoWindow = new BMapGL.InfoWindow('当前街道段可用停车位数量为:' + obj[i].number, opts);
                infoWindows.push(infoWindow)
                map.openInfoWindow(infoWindow, point);
            })
        });
    }
}

function clearParkMarker() {
    for (let i = 0; i < markers.length; i++) {
        map.removeOverlay(markers[i])
    }
}
for (let i = 0; i < infoWindows.length; i++) {
    map.closeInfoWindow(infoWindows[i])
}
var searchMarker = []
function myFun() {
    map.removeOverlay(searchMarker[0])
    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
    map.centerAndZoom(pp, 16);
    var marker = new BMapGL.Marker(pp)
    searchMarker.push(marker)
    map.addOverlay(marker);    //添加标注
}
var local = new BMapGL.LocalSearch(map, { //智能搜索
    onSearchComplete: myFun
});
var searchText = document.getElementById('search')
function search() {
    local.search(searchText.value);
}
// 时间条
let section = document.querySelector("section");
let scroll = document.querySelector(".scroll");
let jd = document.querySelector(".jd");
let ball = document.querySelector(".ball");
//小球默认left值
ball.style.left = section.offsetWidth / 10 - 10 + "px";
//盒子默认宽
jd.style.width = section.offsetWidth / 10 - 10 + "px";
function xj1(e) {
    ///获取鼠标坐标
    let x = e.pageX;
    let y = e.pageY;
    // console.log(x,y)
    //获取父盒子左和上面距离
    let sx = section.offsetLeft;
    let sy = section.offsetTop;
    //获取小球在盒子内的坐标
    let bx = x - sx;
    let by = y - sy;
    //因为是进度条,top值不用改变,只需要bx就可以了
    //获取小球中心点
    let ce = bx - ball.offsetWidth / 2;
    //做边界判断
    if (ce < -10) {
        return;
    }
    if (ce > section.offsetLeft + section.offsetWidth) {
        return;
    }
    //获取scroll的长度,超出长度小球不再前进
    let scrollw = scroll.offsetWidth;
    if (ce + 10 <= scrollw) {
        //更改小球left值
        ball.style.left = ce + "px";
        //更改盒子宽
        jd.style.width = ce + 15 + "px";
    }
}
function xj2(e) {
    ///获取鼠标坐标
    let x = e.pageX;
    let y = e.pageY;
    //获取父盒子左和上面距离
    let sx = section.offsetLeft;
    let sy = section.offsetTop;
    //获取小球在盒子内的坐标
    let bx = x - sx;
    let by = y - sy;
    //因为是进度条,top值不用改变,只需要bx就可以了
    //获取小球中心点
    let ce = bx - ball.offsetWidth / 2;
    //做边界判断
    if (ce < -10) {
        return;
    }
    if (ce > section.offsetLeft + section.offsetWidth) {
        return;
    }
    //获取scroll的长度,超出长度小球不再前进
    let scrollw = scroll.offsetWidth;
    if (ce + 10 <= scrollw) {
        //更改小球left值
        ball.style.left = ce + "px";
        //更改盒子宽
        jd.style.width = ce + 15 + "px";
    }
    var current = new Date();
    var currentHour = current.getHours();
    var currentDay = current.getDay() + 1;
    var showtime = document.getElementsByClassName("date")[0]
    var time = document.getElementsByClassName("time")
    var thisHour = document.getElementById('hourPicker')
    if (ce < scrollw / 5) {
        ball.style.left = scrollw / 10 - 10 + "px";
        thisHour.value = time[0].innerText.slice(1, 2)
        if (currentHour > time[0].innerText.slice(0, 2)) {
            showtime.innerHTML = showtime.innerHTML.slice(0, 9) + addZero(parseInt(currentDay) + 1) + "日" + time[0].innerText.slice(0, 2) + "时"
        }
        else {
            showtime.innerHTML = showtime.innerHTML.slice(0, 12) + time[0].innerText.slice(0, 2) + "时"
        }
        clearParkMarker();
        getData();
    }
    else if (ce < (scrollw / 5) * 2) {
        ball.style.left = (scrollw / 10) * 3 - 10 + "px";
        thisHour.value = time[1].innerText.slice(1, 2)
        if (currentHour > parseInt(time[1].innerText.slice(0, 2))) {
            showtime.innerHTML = showtime.innerHTML.slice(0, 9) + addZero(parseInt(currentDay) + 1) + "日" + time[1].innerText.slice(0, 2) + "时"
        }
        else {
            showtime.innerHTML = showtime.innerHTML.slice(0, 12) + time[1].innerText.slice(0, 2) + "时"
        }
        getData();
        clearParkMarker();
    }
    else if (ce < (scrollw / 5) * 3) {
        ball.style.left = (scrollw / 10) * 5 - 10 + "px";
        thisHour.value = time[2].innerText.slice(1, 2)
        if (currentHour > parseInt(time[2].innerText.slice(0, 2))) {
            showtime.innerHTML = showtime.innerHTML.slice(0, 9) + addZero(parseInt(currentDay) + 1) + "日" + time[2].innerText.slice(0, 2) + "时"
        }
        else showtime.innerHTML = showtime.innerHTML.slice(0, 12) + time[2].innerText.slice(0, 2) + "时"
        getData();
        clearParkMarker();
    }
    else if (ce < (scrollw / 5) * 4) {
        ball.style.left = (scrollw / 10) * 7 - 10 + "px";
        thisHour.value = time[3].innerText.slice(1, 2)
        if (currentHour > parseInt(time[3].innerText.slice(0, 2))) {
            showtime.innerHTML = showtime.innerHTML.slice(0, 9) + addZero(parseInt(currentDay) + 1) + "日" + time[3].innerText.slice(0, 2) + "时"
        }
        else showtime.innerHTML = showtime.innerHTML.slice(0, 12) + time[3].innerText.slice(0, 2) + "时"
        getData();
        clearParkMarker();
    }
    else {
        ball.style.left = (scrollw / 10) * 9 - 10 + "px";
        thisHour.value = time[4].innerText.slice(1, 2)
        if (currentHour > parseInt(time[4].innerText.slice(0, 2))) {
            showtime.innerHTML = showtime.innerHTML.slice(0, 9) + addZero(parseInt(currentDay) + 1) + "日" + time[4].innerText.slice(0, 2) + "时"
        }
        else showtime.innerHTML = showtime.innerHTML.slice(0, 12) + time[4].innerText.slice(0, 2) + "时"
        getData();
        clearParkMarker();
    }
}
//单击鼠标触发鼠标的click事件
section.addEventListener("click", xj2);
//鼠标按下触发鼠标的move事件
section.addEventListener("mousedown", function () {
    document.addEventListener("mousemove", xj1);
});
//松开鼠标移除事件
document.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", xj1);
});
function addZero(s) {
    s = parseInt(s)
    return s < 10 ? ('0' + s) : s;
}