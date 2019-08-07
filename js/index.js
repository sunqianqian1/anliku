window.onload = function() {
    // 生成所需要的li
    (function() {
        var len = 5 * 5 * 5, //生成li的总数
            aUl = document.getElementById('list').children[0], //获取Ul
            aLi = aUl.children; //动态获取所有的Li
        //初始化
        (function() {
            for (var i = 0; i < len; i++) {
                // 创建li
                var oLi = document.createElement('li');
                // 为每个li添加相关的属性值,下标
                oLi.index = i;
                oLi.x = i % 5;
                oLi.y = Math.floor(i % 25 / 5);
                oLi.z = 4 - Math.floor(i / 25);
                // 获取我们的数据
                var data = flyData[i] || flyData[18];

                // 添加li的内容
                oLi.innerHTML = "<b class='liCover'></b>" +
                    "<p class='liTitle'>" + data.title + "</p>" +
                    "<p class='liType'>" + data.type + "</p >" +
                    "<p class='liTime'>" + data.time + "</p>";
                // 定义li 在3D空间的随机位置
                var tX = Math.random() * 6000 - 3000,
                    tY = Math.random() * 6000 - 3000,
                    tZ = Math.random() * 6000 - 3000;

                // 设置li的初始值
                oLi.style.transform = "translate3D(" + tX + "px," + tY + "px," + tZ + "px)";
                // 添加li
                aUl.appendChild(oLi);
            }
            setTimeout(Grid, 20);
        })(); //两个自执行函数中间要加;js不认识

        // 拖拽，缩放
        (function() {
            // 获取初始ul的位置
            var csX = 0,
                csY = 0,
                csZ = -2000;
            // 清除字体选中
            document.onselectstart = function() {
                    return false;
                }
                // 鼠标按下时
            document.onmousedown = function(e) {
                e = e || e.event;
                // 定义变量的值
                var sX = e.clientX, //鼠标按下的x位置
                    sY = e.clientY, //鼠标按下的y位置
                    lastX = sX, //存储最后一次x的位置
                    lastY = sY, //存储最后一次y的位置
                    x_ = 0, //两次之间的距离
                    y_ = 0, //两次之间的距离
                    moveTime = 0, //初始的时间
                    timeD = new Date(); //保存鼠标按下的时间

                // 判断鼠标按下的li的事件源是否是B,是的话就不弹窗
                if (e.target.nodeName == 'B') {
                    var thisLi = e.target;
                }


                //鼠标移动时
                this.onmousemove = function(e) {
                        e = e || e.event;
                        x_ = e.clientX - lastX;
                        y_ = e.clientY - lastY;
                        // 通过鼠标移动的距离计算旋转的度数
                        csX += x_ * 0.15;
                        csY -= y_ * 0.15;
                        aUl.style.transform = "translateZ(" + csZ + "px) rotateX(" + csY + "deg) rotateY(" + csX + "deg)";
                        // 重新赋值
                        lastX = e.clientX;
                        lastY = e.clientY;
                        // 获取每次鼠标移动后的时间
                        moveTime = new Date();
                    }
                    // 鼠标抬起时
                this.onmouseup = function(e) {
                    e = e || e.event;


                    // 判断鼠标抬起和按下是否是同一个事件源
                    if (e.target == thisLi && new Date() - timeD > 500) {
                        thisLi.buzhixing = true;
                    }

                    // 清楚鼠标移动事件
                    this.onmousemove = null;
                    // 计算缓冲
                    function move() {
                        // 通过系数，慢慢减少移动的距离
                        x_ *= 0.9;
                        y_ *= 0.9;
                        // 通过距离，计算旋转的值
                        csX += x_ * 0.15;
                        csY -= y_ * 0.15;
                        aUl.style.transform = "translateZ(" + csZ + "px) rotateX(" + csY + "deg) rotateY(" + csX + "deg)";
                        if (Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1) return;
                        requestAnimationFrame(move);
                    }
                    if (new Date - moveTime < 100) {
                        requestAnimationFrame(move)
                    }
                }

            };
            // 滚轮滚动改变z轴，控制放大缩小事件
            !(function(fn) {
                if (document.onmousewheel === undefined) {
                    // 火狐浏览器
                    document.addEventListener('DOMMouseScroll', function(e) {
                        e = e || e.event;
                        var d = -e.detail / 3;
                        fn(d);
                    }, false)
                } else {
                    // 主流浏览器
                    document.onmousewheel = function(e) {
                        e = e || e.event;
                        var d = e.wheelDelta / 120;
                        fn(d);
                    }
                }
            })(function(d) {
                csZ += d * 100;
                aUl.style.transform = "translateZ(" + csZ + "px) rotateX(" + csY + "deg) rotateY(" + csX + "deg)";
            });
            // 点击li弹出
            (function() {
                // 获取元素
                var oAlert = document.getElementById('alert'),
                    oTitle = oAlert.getElementsByClassName('title')[0].getElementsByTagName('span')[0],
                    oImg = oAlert.getElementsByClassName('img')[0].getElementsByTagName('img')[0],
                    oAuthor = oAlert.getElementsByClassName('author')[0].getElementsByTagName('span')[0],
                    oInfo = oAlert.getElementsByClassName('info')[0].getElementsByTagName('span')[0];
                // 获取点击弹出需要使用的元素
                var oAll = document.getElementById('all');
                var oFrame = document.getElementById('frame');
                var oBack = document.getElementById('back');
                // 通过事件委托将每个li委托给ul
                aUl.onclick = function(e) {
                    e = e || e.event;
                    // 获取事件源
                    var target = e.target;
                    // 判断事件源在谁身上
                    if (target.nodeName == 'B') {
                        if (target.buzhixing) {
                            target.buzhixing = false;
                        } else {
                            if (oAlert.style.display == 'block') {
                                // 希望关闭
                                hide();
                            } else {
                                //确定是隐藏状态，希望显示
                                // 判断点击的是哪个li,获取下标
                                var index = target.parentNode.index;

                                // 通过li获取每个对应的数据
                                var data = flyData[index] || flyData[18];

                                // 将每个li的下标绑定到oAlert上
                                oAlert.index = index;

                                // 修改弹窗内容
                                oTitle.innerHTML = "标题: " + data.title;
                                oImg.innerHTML = "src" + data.src + "+/index.png+"
                                oAuthor.innerHTML = "作者: " + data.author;
                                oInfo.innerHTML = "描诉: " + data.dec;

                                // 信息改变之后让它显示，用函数写
                                show();
                            }
                        }

                    }
                    // 取消事件冒泡
                    e.cancelBubble = true;
                }

                // 弹出之后关闭
                function hide() {
                    if (oAlert.style.display == 'block' && !oAlert.timer) {
                        oAlert.timer = true;

                        // 初始隐藏前的值
                        oAlert.style.display = 'block';
                        oAlert.style.opacity = '1';
                        oAlert.style.transform = "rotateY(0deg) scale(1)";

                        var time = 300;
                        var sTime = new Date();
                        // 运动函数，让oAlert从1到0
                        function active() {
                            var prop = (new Date() - sTime) / time;
                            if (prop >= 1) { //判断prop是否等于1，等于1表示oAlert缩放到正常大小
                                prop = 1;
                                oAlert.timer = false;
                                oAlert.style.display = 'none';
                            } else { //否则的话就让运动函数继续执行
                                requestAnimationFrame(active);
                            }
                            oAlert.style.transform = "rotateY(" + prop * 180 + "deg) scale(" + (1 - prop) + ")";
                            oAlert.style.opacity = 1 - prop;
                        }
                        // 让定时器执行运动函数
                        requestAnimationFrame(active);
                    }
                }

                // 点击oAlert跳转
                oAlert.onclick = function() {
                    // 获取数据
                    var data = flyData[this.index] || flyData[18];
                    oFrame.src = 'src/' + data.src + '/index.html';
                    oAll.className = 'left';
                    // 阻止事件冒泡
                    return false;
                }

                //点击返回按钮
                oBack.onclick = function() {
                        oAll.className = '';
                    }
                    // 点击除了oAlert以外的地方也消失
                document.onclick = function() {
                    hide();
                }

                //点击之后弹出的内容显示
                function show() {
                    // 防止误重新点击
                    if (!oAlert.timer) {
                        oAlert.timer = true;
                        oAlert.style.display = 'block';
                        //因为弹窗是从大变小的(放大到缩小)，要设置他的初始位置,并且透明度是从0到1的
                        oAlert.style.transform = "rotateY(0deg) scale(2)";
                        oAlert.style.opacity = '0';
                        // 设置初始的时间
                        var time = 300;
                        var sTime = new Date();
                        // 运动函数，让oAlert从放大2倍的大小到缩小到正常位置
                        function active() {
                            var prop = (new Date() - sTime) / time;
                            if (prop >= 1) { //判断prop是否等于1，等于1表示oAlert缩放到正常大小
                                prop = 1;
                                oAlert.timer = false;
                            } else { //否则的话就让运动函数继续执行
                                requestAnimationFrame(active);
                            }
                            oAlert.style.transform = "rotateY(0deg) scale(" + (2 - prop) + ")";
                            oAlert.style.opacity = prop;
                        }
                        // 让定时器执行运动函数
                        requestAnimationFrame(active);
                    }

                }
            })()

        })();

        // 四个按钮点击事件
        (function() {
            // 获取所有点击的按钮
            var oBtn = document.getElementById('btn').getElementsByTagName('li');
            var arr = [Table, Sphere, Helix, Grid];
            for (var i = 0; i < oBtn.length; i++) {
                oBtn[i].onclick = arr[i];
            }
        })();

        // Table 元素周期表部分 
        function Table() {
            if (Table.arr) {
                // 不是第一次执行
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Table.arr[i];
                }
            } else {
                // 定义行数
                var n = Math.ceil(len / 18) + 2;
                // 计算Ul中心点的位置
                var midX = 18 / 2 + 0.5; ///ul在x轴中间的位置
                var midY = n / 2 + 0.5; //ul在y轴中间的位置

                Table.arr = [];
                // 定义每个li的边距
                var disX = 180;
                var disY = 220;

                // 前18个li的坐标
                var arr = [
                    { x: 0, y: 0 },
                    { x: 17, y: 0 },
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 12, y: 1 },
                    { x: 13, y: 1 },
                    { x: 14, y: 1 },
                    { x: 15, y: 1 },
                    { x: 16, y: 1 },
                    { x: 17, y: 1 },
                    { x: 0, y: 2 },
                    { x: 1, y: 2 },
                    { x: 12, y: 2 },
                    { x: 13, y: 2 },
                    { x: 14, y: 2 },
                    { x: 15, y: 2 },
                    { x: 16, y: 2 },
                    { x: 17, y: 2 },
                ]

                // 循环计算li的坐标
                for (var i = 0; i < len; i++) {
                    var x, y;
                    if (i < 18) {
                        x = arr[i].x;
                        y = arr[i].y;
                    } else {
                        x = i % 18;
                        y = Math.floor(i / 18) + 2;
                    }
                    // 设置li的位置
                    var val = "translate3D(" + (x - midX) * disX + "px," + (y - midY) * disY + "px,0px)";
                    Table.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }

        };

        // Sphere球形
        function Sphere() {
            if (Sphere.arr) {
                // 有证明不是第一次执行，则用缓存
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Sphere.arr[i];
                }
            } else {
                // 没有证明第一次执行
                Sphere.arr = [];
                // 定义球面li一共有多少层，以及每层有多少个li
                var arr = [1, 3, 7, 9, 11, 14, 21, 16, 12, 10, 9, 7, 4, 1],
                    arrLen = arr.length,
                    xDeg = 180 / (arrLen - 1); //每一层li旋转的度数

                // 遍历所有的li
                for (var i = 0; i < len; i++) {
                    // 定义变量来保存此时的i是球面上的第几层，以及当前层的第几个
                    var numC = 0, //当前层
                        numG = 0, //当前层第几个
                        arrLi = 0; //当前层一共有多少个li

                    // 判断此时的i是第几层的第几个
                    for (var j = 0; j < arrLen; j++) {
                        arrLi += arr[j]; //第0层有1一个li

                        // 判断li是第几层第几个
                        if (arrLi > i) {
                            numC = j;
                            numG = arr[j] - (arrLi - i);
                            break;
                        }
                    }

                    // 求每一个li的y轴旋转度数
                    var yDeg = 360 / arr[numC];
                    // 设置li的旋转
                    var val = "rotateY(" + (numG + 1.3) * yDeg + "deg) rotateX(" + (90 - numC * xDeg) + "deg) translateZ(800px)"
                    Sphere.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }

        }

        // Helix　螺旋式
        function Helix() {
            if (Helix.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Helix.arr[i];
                }
            } else {
                Helix.arr = [];
                // 定义行数
                var h = 3.8;
                // 定义每一行多少个li
                var hLi = Math.round(len / h);
                // 定义每一个li沿着y轴旋转的度数　
                var degY = 360 / hLi;
                // 定义每个li上下错位值
                var c = 7;
                // 定义中间值
                var mid = Math.ceil(len / 2);

                for (var i = 0; i < len; i++) {
                    var val = "rotateY(" + i * degY + "deg) translateY(" + (i - mid) * c + "px) translateZ(700px)";
                    aLi[i].style.transform = val;
                    Helix.arr[i] = val;
                }
            }
        }

        // Grid
        function Grid() {
            // 优化性能，存在执行缓存
            if (Grid.arr) {
                // 存在表示不是第一次点击
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Grid.arr[i];
                }
            } else {
                // 第一次点击
                Grid.arr = [];
                // 定义每个li方向的距离
                var jX = 350,
                    jY = 350,
                    jZ = 500;
                // 循环每个li,添加值
                for (var i = 0; i < aLi.length; i++) {
                    var oLi = aLi[i];
                    var x = (oLi.x - 2) * jX,
                        y = (oLi.y - 2) * jY,
                        z = (oLi.z - 2) * jZ;
                    var val = "translate3D(" + x + "px," + y + "px," + z + "px)";
                    Grid.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }

        }
    })()
}