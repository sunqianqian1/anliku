window.onload = function() {
    // 获取元素
    let recHeader = $('.rec-header')[0];
    let recList = $('.rec-list')[0];
    let control = $('.control')[0];


    // 获取推荐图片
    $.get(
        'http://localhost:3000/banner',
        function({ banners }) {
            // console.log(banners);
            recHeader.style.background = `url(${banners[0].imageUrl}) no-repeat 0 0/auto 100%`
        }
    );

    let idList = [];
    let nameList = [];
    let imgList = [];


    // 获取推荐音乐
    $.get(
        'http://localhost:3000/personalized/newsong',
        function({ result }) {
            console.log(result);
            recList.innerHTML = '';
            result.forEach((val, index) => {
                idList.push(val.id);
                nameList.push(val.name);
                imgList.push(val.song.album.picUrl);
                recList.innerHTML += `
                    <li class="rec-item">
                        <a class='playing' href="#">
                            <div class="item-info">
                                <div class="info-img">
                                    <img src="${val.song.album.picUrl}" alt="">
                                </div>
                                <div class="info">
                                    <div class="info-title">
                                        ${val.name}
                                    </div>
                                    <div class="info-desc">
                                        许美静 - 都是夜归人
                                    </div>
                                </div>
                            </div>
                            <div class="item-play">
                                <span class="iconfont icon-bofang1"></span>
                                <span class="iconfont icon-more1170511easyiconnet"></span>
                            </div>
                        </a>
                    </li>
                `
            });
            let playing = [...$('.playing')]; //获取当前数组
            window._audio = document.createElement('audio'); //创建一个全局的audio标签

            // 处理点击事件
            playing.forEach((val, index) => {
                val.index = index; //将每一个下标取出来

                val.onclick = function() {
                    control.style.display = 'block';

                    $.get(
                        `http://localhost:3000/song/url?id=${idList[this.index]}`,
                        function({ data }) {
                            console.log(data);
                            _audio.src = data[0].url;
                            _audio.play()
                        }
                    );

                    // 更改空间内容
                    control.innerHTML = `
                    <a href="../src/play.html?id=${idList[this.index]}">
                    <div class="control-content">
                      <div class="con-img">
                        <img src="${imgList[this.index]}" alt="">
                      </div>
                      <div class="con-info">
                        <div class="con-title">
                          ${nameList[this.index]}
                        </div>
                        <div class="con-desc">
                          滑动可以切换音乐
                        </div>
                      </div>
                    </div>
            
                    <div class="con-play">
                      <div class="con-playing">
                        <span class="iconfont icon-zanting"></span>
                      </div>
            
                      <span class="iconfont icon-bofangliebiao"></span>
            
                    </div>
                  </a>
                    `
                }
            })


        }
    )
}