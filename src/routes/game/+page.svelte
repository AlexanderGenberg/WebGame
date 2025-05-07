<script>
	import { onMount } from "svelte";


    // bilder
    let pressImage = "assets/press.png"
    let heartImage = "assets/heart.png"
    let backGroundImage = "assets/background3.png"
    
    // varaibles

    let playerImages = []
    let player = {x:100, vxl:0, vxr:0, speed:4, health:5, states: ["Green", "Yellow", "Orange", "Red"], state: "Green", image: 0}

    let presses = [{pressPos: 0, Bottom: 640}, {pressPos: 1, Bottom: 640}, {pressPos: 2, Bottom: 640}]
    let pressIsDown = 1

    let backGroundHeight
    let fromBottom
    let windowHeight

    let startCount = true
    let countDown = 3

    // create Player image list

    for (let state of player.states) {
        for (let i = 1; i <= 2; i++) {
            playerImages.push("assets/player/player" + state + i.toString() + ".png")
        }
    }

    // Pleyer Movment

    function onKeyDown(e) {
        player.speed = 4*backGroundHeight/762
        switch(e.keyCode) {
            case 39: case 68: {//höger
            player.vxr = player.speed
            break
            }
            case 37: case 65: { //vänster
            player.vxl = player.speed
            break
            }
        }
    }

    function onKeyUp(e) {
        switch(e.keyCode) {
            case 39: case 68: {//höger
            player.vxr = 0
            break
            }
            case 37: case 65: {//vänster
            player.vxl = 0
            break
            }
        }
    }

    function updateMovment() {
        if (player.x <= 0) player.x = 0
        else player.x += player.vxr - player.vxl

        if (player.x > window.innerWidth - 100) player.x = window.innerWidth - 100
        else player.x += player.vxr - player.vxl

        requestAnimationFrame(updateMovment)
    }

    // Player take damage

    function checkIfDamage() {
        let playerElement = window.getComputedStyle(document.getElementById("player"))
        let pressSizeX = 512
        let playerSizeX = 96

        for(let press of presses) {
            let pressElement = window.getComputedStyle(document.getElementById("press" + (press.pressPos)))

            if (playerElement.getPropertyValue("left") < ((press.pressPos) * (window.innerWidth/3)) && 
                (playerElement.getPropertyValue("left")+playerSizeX) > ((press.pressPos) *  ((window.innerWidth/3) + pressSizeX))) {
                    console.log("dead")
            }
        }
        requestAnimationFrame(checkIfDamage)
    }

    onMount(()=>{updateMovment(); checkIfDamage()})

    // Player animation

    function animatePlayer() {
        if (player.image==1) player.image = 0
        else player.image = 1
    }

    setInterval(animatePlayer, 500)

    // press

    function changePress() {
        startCount = false
        backGroundHeight = parseInt(window.getComputedStyle(document.getElementById("backGroundImage")).getPropertyValue("height").slice(0,-2))
        windowHeight = window.innerHeight - 64
        fromBottom = windowHeight - backGroundHeight

        pressIsDown = Math.round(Math.random()*2)
        for (let press of presses) {
            if (press.pressPos == pressIsDown) {press.Bottom = fromBottom + backGroundHeight/9+2}
            else {press.Bottom = fromBottom + backGroundHeight*0.7}
        }

        presses = [...presses]
    }

    setInterval(changePress, 2500)

    // Startup

    setTimeout(()=> {countDown -= 1; setTimeout(()=> {countDown -= 1; setTimeout(()=> {countDown -= 1; } ,2500/3)} ,2500/3)} ,2500/3)

</script>

<p class="countDown" class:hide = {countDown == 0}>{countDown}</p>

<main class:hide = {startCount}>
    <div>
        <div id="presses">
            {#each presses as press}
                <img src="{pressImage}" alt="press" id="press{press.pressPos}"class="press" class:active = {press.pressPos == pressIsDown} style="bottom:{press.Bottom}px; left:{(press.pressPos/3)*100}%; width:{100/3}vw;">
            {/each}
        </div>
        <img src="{playerImages[player.image]}" alt="player" id="player" style="left:{player.x}px; bottom:{fromBottom + backGroundHeight/9}px; width:{80*backGroundHeight/762}px; height:{80*backGroundHeight/762}px;">
    </div>
    
    <img src="{backGroundImage}" alt="The background" id="backGroundImage">
    
    <div id="hearts">
        {#each Array(player.health) as _}
            <img src="{heartImage}" alt="health item" class="heart" style="width:{64*backGroundHeight/762}px; height:64*{backGroundHeight/762};">
        {/each}
    </div>
</main>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp}/>

<style>
    main{
        display: grid;
        height: 92vh;
        grid-template-rows:8fr 1fr;
        aspect-ratio: 817.05/1536;
    }

    .press {
        z-index: -1;
        transition: 1000ms bottom linear;
        position: absolute;
    }

    #presses {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .active {
        transition: 1500ms bottom linear;
    }

    #hearts {
        display: flex;
        position: absolute;
    }

    .heart {
        margin: 8px;
    }

    #player {
        position: absolute;
    }

    #backGroundImage {
        position: fixed;
        z-index: -2;
    }
    
    .hide {
        opacity: 0;
    }

    .countDown {
        position:absolute;


    }

    @media (max-width: 768px) {
        main {
            display: none;
        }
    }
</style>