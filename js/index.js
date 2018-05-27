{
  let view = {
    el: "#app",
    render(rowsKeys, rowsValues) {
			let container = document.createElement('div')
			container.setAttribute('class','container')
			document.querySelector(this.el).appendChild(container)
			rowsKeys.forEach((row, rowIndex) =>{
				let div = document.createElement('div')
				div.setAttribute('class','row')
				row.forEach((key, keyIndex) =>{
					let kbd = document.createElement('kbd')
					kbd.innerText = key
					kbd.setAttribute('data-site',rowsValues[rowIndex][keyIndex])
					kbd.setAttribute('title',rowsValues[rowIndex][keyIndex])
					div.appendChild(kbd)
				})
				container.appendChild(div)
			})
		},
		changeTitle(key,site){
			let kbds = Array.prototype.slice.call(document.getElementsByTagName('kbd'))
			let kbd = kbds.filter(item => {
				return item.innerText.toLowerCase() === key
			})[0]
			kbd.setAttribute('title',site)
		}
  };

  let model = {
    links: [
      {
        q: "",
        w: "",
        e: "",
        r: "",
        t: "",
        y: "",
        u: "",
        i: "",
        o: "",
        p: ""
      },
      {
        a: "",
        s: "",
        d: "",
        f: "",
        g: "",
        h: "",
        j: "",
        k: "",
        l: ""
      },
      {
        z: "",
        x: "",
        c: "",
        v: "",
        b: "baidu.com",
        n: "",
        m: ""
      }
		],
		rowsKeys: [],
		rowsValues: [],
		onInput: false,
		getRows(links){
			links.forEach(row => {
				this.rowsKeys.push(Object.keys(row))
				this.rowsValues.push(Object.values(row))
			});
		},
		saveNavgatiton(){
			localStorage.setItem('navigation',JSON.stringify(this.links))
			alert('恭喜您保存导航成功。')
			location.reload()
		},
		getNavigation(){
			if(localStorage.getItem('navigation')){
				this.links = JSON.parse(localStorage.getItem('navigation'))
			}
		}
  };

  let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.model.getNavigation()
			this.model.getRows(this.model.links)
			this.view.render(this.model.rowsKeys,this.model.rowsValues)
			this.bindEvents()
		},
		openSite(key){
			this.model.links.forEach((row) => {
				let keys = Object.keys(row)
				if(keys.indexOf(key) !== -1){
					let site = row[key]
					site === '' ? alert('您点击的按键暂时没有设置导航链接。') : window.open(`//${site}`)
				}
			})
		},
		getQuery(){
			let input = document.getElementById('search-key')
			let value = input.value
			return value
		},
		search(url){
			let query = this.getQuery()
			query === '' ? alert('查询关键词不能为空') : window.open(`${url}${query}`)
		},
		setKeySite(){
			let key = window.prompt('请输入您要编辑的按键。').toLowerCase()
			let site = window.prompt('请输入该对应按键的导航网址。','如：www.baidu.com')
			this.model.links.forEach((row,index) => {
				let keys = Object.keys(row)
				if(keys.indexOf(key) !== -1){
					this.model.links[index][key] = site
				}
			})
			this.view.changeTitle(key,site)
			alert('恭喜您修改导航成功。')
		},
		bindEvents(){
			document.querySelector('.container').addEventListener('click', (e) =>{
				if(e.target.nodeName === 'KBD'){
					let site = e.target.getAttribute('data-site')
					if(!this.model.onInput){
						site === '' ? alert('您点击的按键暂时没有设置导航链接。') : window.open(`//${site}`)					
					}
				}
			})
			window.addEventListener('keydown',e => {
				let key = e.key
				if(this,model.onInput === true){
					if(key === 'Enter'){
						this.search('//baidu.com/s?wd=')
					}
				}else{
					if(e.ctrlKey === false && key.search(/[a-z]/) !== -1){
						this.openSite(key)
					}else if(e.ctrlKey && key === 'd'){
						this.setKeySite()
					}else if(e.ctrlKey && key === 's'){
						this.model.saveNavgatiton()
					}
				}
			})
			document.getElementById('search-key').addEventListener('focus',e => {
				this.model.onInput = !this.model.onInput
			})
			document.getElementById('search-key').addEventListener('blur',e => {
				this.model.onInput = !this.model.onInput
			})
			document.querySelector('.baidu').addEventListener('click',(e) => {
				this.search('//baidu.com/s?wd=')
			})
			document.querySelector('.google').addEventListener('click',(e) => {
				this.search('//google.com/search?q=')
			})
		}
	};

	controller.init(view, model)
}
