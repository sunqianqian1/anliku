window.onload = function() {
    // console.log(location.href);

    // 获取元素
    let disc = $('.disc')[0];
    let playing = $('.playing')[0];
    let currentTime = $('.currentTime')[0];
    let duration = $('.duration')[0];
    let proBar = $('.pro-bar')[0];
    let proBg = $('.pro-bg')[0];
    let progress = $('.progress')[0];
    let playWrap = $('.play-wrap')[0];
    let lyricWrap = $('.lyric-wrap')[0];


    let mark = true;


    // 提取id的方法
    (function(str) {
        if (!str.includes('?')) return;
        let arr = str.split("?")[1].split('&');
        arr.forEach((item, index) => {
            let dataArr = item.split('=');
            // datas[dataArr[0]] = dataArr[1];
            if (dataArr[0] == 'id') {
                localStorage.setItem(dataArr[0], dataArr[1]);
            }

        })

    })(location.href);

    let datas = {};
    datas.id = localStorage.getItem('id');

    window._audio = document.createElement('audio');

    // 获取歌曲详情
    $.get(
        `http://localhost:3000/song/detail?ids=${datas.id}`,
        function({ songs: [{ al: { picUrl } }] }) {
            // console.log(picUrl);
            disc.innerHTML = `
        <img src="${picUrl}" alt="">
      `
        }
    );


    // 获取音乐播放
    $.get(
        `http://localhost:3000/song/url?id=${datas.id}`,
        function({ data: [{ url }] }) {
            console.log(url);
            disc.style.animation = 'rotate 10s linear infinite';
            _audio.src = url;
            _audio.play();


            // 监听音乐是否播放完毕
            _audio.addEventListener('ended', function() {
                disc.style.animation = '';
            })

            // 监听播放
            _audio.addEventListener('timeupdate', function() {
                nowTime();
            });

            // 播放时间
            function nowTime() {
                // 总时间
                duration.innerHTML = time(_audio.duration);
                currentTime.innerHTML = time(_audio.currentTime);

                // 进度条
                let n = _audio.currentTime / _audio.duration;
                proBar.style.left = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 100 + 'rem';
                proBg.style.width = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 100 + 'rem';
            }

            // 处理时间函数
            function time(cTime) {
                cTime = parseInt(cTime);
                let m = zero(Math.floor(cTime % 3600 / 60));
                let s = zero(Math.floor(cTime % 60));

                return `${m}:${s}`
            }
            // 两位数时间格式
            function zero(num) {
                return num < 10 ? '0' + num : '' + num;
            }



            // 处理控件
            playing.onclick = function() {
                let str = '';
                let animation = '';
                if (mark) {
                    _audio.pause();
                    str = "icon-bofang";
                } else {
                    _audio.play();
                    str = "icon-pause";
                    animation = 'rotate 10s linear infinite';
                }
                mark = !mark;
                this.innerHTML = `
            <span class="iconfont ${str}"></span>
          `;

                disc.style.animation = animation;
                return false;
            }


            // 点击歌词
            playWrap.onclick = function() {
                disc.style.display = 'none';
                $.get(
                    `http://localhost:3000/lyric?id=${datas.id}`,
                    function({ lrc: { lyric } }) {
                        console.log(lyric)
                        let data = lyric.split('[');
                        console.log(data);

                        data.forEach((item, index) => {
                            // console.log(item)
                            if (!item) return;
                            // console.log(item);

                            let dataArr = item.split(']');
                            // console.log(dataArr);
                            let time = dataArr[0].split('.')[0];
                            // console.log(time)

                            let lyricStr = dataArr[1];
                            // console.log(lyricStr)

                            let timeArr = time.split(':');
                            // console.log(timeArr);

                            let timer = timeArr[0] * 60 + timeArr[1] * 1;
                            // console.log(timer);

                            let p = document.createElement('p');
                            p.id = 'ly' + timer;
                            p.className = 'lyr';
                            p.innerHTML = lyricStr;
                            lyricWrap.appendChild(p);


                        })


                        // 获取所有的p标签
                        let pArr = ([...$('.lyr')]);
                        console.log(pArr);

                        _audio.addEventListener('timeupdate', function() {
                            // console.log('ly' + parseInt(_audio.currentTime))

                            let currentTime = parseInt(_audio.currentTime);

                            pArr.forEach((item, index) => {
                                if (item.id == 'ly' + currentTime) {
                                    lyricWrap.style.marginTop = -(item.offsetTop / 100) + 'rem';

                                    if (index > 0) {
                                        pArr[index - 1].style.color = '#7f7676'
                                    }

                                    item.style.color = '#fff'
                                }
                            })
                        })
                    }
                )
            }
        }
    )
}