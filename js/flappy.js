function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div','barreira')

    const borda = novoElemento('div','borda')
    const corpo = novoElemento('div','corpo')

    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.hieght= `${altura}px`
}

//const b = new Barreira(true)
//b.setAltura(200)
//document.querySelector('[wm-flappy]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div','par-de-barreiras')
    
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sorterarAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior =  altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = () => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sorterarAbertura()
    this.setX(x)
}


//const b =  new ParDeBarreiras(700,200,400)

//document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura , largura, abertura, espaco,notificarPonro){
    this.pares = [
        new ParDeBarreiras(altura,abertura, largura),
        new ParDeBarreiras(altura,abertura,largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura,abertura,largura + espaco *3 )
    ]

    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
          par.setX(par.getX() - deslocamento)  

          // QUANDO O ELEMENTO SAIR DE ÁREA DO JOGO
          if(par.getX() < -par.getLargura()){
            par.setX(par.getX() + espaco * this.pares.length)
            par.sorterarAbertura()
          }

          const meio =  largura / 2
          const cruzouMeio = par.getX() + deslocamento >= meio
            && par.getX() < meio

           if( cruzouMeio) notificarPonto()
        })
    }
}

function passaro (alturaJogo){
    let voando = flase

    this.elemento = novoElemento('img','passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY  = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar() = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = altura - this.elemento.clientHeight

        if(novoY <= 0){
            this.setY(0)
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}



function Progresso() {
    this.elemento = novoElemento('span','progresso')
    this.atualizarPontos = () => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
    
}

function estaoSobrePostos(elementoA,elementoB) {
    const a = elementoA.getBoundClientRect()
    const b = elementoB.getBoundClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.hieght >= b.top && b.top + b.hieght >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento

            colidiu = estaoSobrePostos(passaro.elemento,superior)
                || estaoSobrePostos(passaro.elemeto,inferior)
        }
    })
    return colidiu
}

function FlappyBird () {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flapyy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const  progresso = new Progresso()
    const barreiras = new Barreiras(altura,largura,200,400,
        () => progresso.atualizarPontos(++pontos))
    const passaroa = new passaro(altura)
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaroa.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))


    this.start = () => {
        //LOOP DO JOGO
        const temporizado = setInterval(() =>{
            barreiras.animar()
            passaroa.animar()

            if(colidiu(passaroa,barreiras)){
                clearInterval(temporizado )
            }
        },20)
    }
}

new FlappyBird().start()
