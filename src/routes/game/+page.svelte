<script>
	import { onMount } from "svelte";
    import {savedScore} from "$lib/highscore";
    import { base } from "$app/paths";

    // https://www.youtube.com/watch?v=bz4IB-RorZ8 För att få objekten att rotera


    // bilder
    let pressImage = "assets/press.png"
    let heartImage = "assets/heart.png"
    let backGroundImage = "assets/background3.png"

    // varaibles

    let player = {x:100, vxl:0, vxr:0, speed:7, health:6, states: ["Green", "Yellow", "Orange", "Red"], state: "Green", image: 1}
    let playerSizeX
    let playerY
    let dmgAvalable = true
    let dmgTaken = false

    let presses = [{pressPos: 0, Bottom: 640}, {pressPos: 1, Bottom: 640}, {pressPos: 2, Bottom: 640}]
    let pressIsDown = 1

    let backGroundHeight
    let fromBottom
    let windowHeight

    let startCount = true

    let flyingObjects = []
    let nextBullet = ["Green", "Orange", "Red"]
    let bullets = []
    let shootable = true
    
    let poang = 0
    let gameover = false

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
            case 32: {shoot()}
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
        playerSizeX = Number(window.getComputedStyle(document.getElementById("player")).getPropertyValue("width").slice(0, -2))
        playerY = Number(window.getComputedStyle(document.getElementById("player")).getPropertyValue("bottom").slice(0, -2))
        if (player.x <= 0) player.x = 0
        else player.x += player.vxr - player.vxl

        if (player.x > window.innerWidth - playerSizeX) player.x = window.innerWidth - playerSizeX
        else player.x += player.vxr - player.vxl

        requestAnimationFrame(updateMovment)
    }

    // Player take damage

    function checkIfDamage() {
        for (let press of presses) {
            let pressX = Number(window.getComputedStyle(document.getElementById("press"+press.pressPos.toString())).getPropertyValue("left").slice(0, -2))
            let pressWidth = Number(window.getComputedStyle(document.getElementById("press"+press.pressPos.toString())).getPropertyValue("width").slice(0, -2))
            let pressY = Number(window.getComputedStyle(document.getElementById("press"+press.pressPos.toString())).getPropertyValue("bottom").slice(0, -2))
            if (
                player.x + playerSizeX > pressX && 
                player.x < pressX + pressWidth && 
                playerY + Number(playerSizeX) >= pressY){
                takeDmg()
            }
        }
        requestAnimationFrame(checkIfDamage)
    }

    // Player take dmg

    function takeDmg() {
        if (player.health > 0 && dmgAvalable == true) {
            dmgAvalable = false
            dmgTaken = true
            player.health -= 1
            setTimeout(() => (dmgAvalable = true), 2000)
            setTimeout(() => (dmgTaken = false), 1000)
        }

        else if (player.health == 0) {
            gameover = true
        }
    }

    // Player animation

    function animatePlayer() {
        if (player.image==1) player.image = 2
        else player.image = 1
    }

    setInterval(animatePlayer, 500)

    // press

    function changePress() {
        startCount = false
        backGroundHeight = parseInt(window.getComputedStyle(document.getElementById("backGroundImage")).getPropertyValue("height").slice(0,-2))
        windowHeight = window.innerHeight - 64
        fromBottom = windowHeight - backGroundHeight

        pressIsDown = Math.round(Math.random()*presses.length)
        for (let press of presses) {
            if (press.pressPos == pressIsDown) {press.Bottom = fromBottom + backGroundHeight/9+2}
            else {press.Bottom = fromBottom + backGroundHeight*0.7}
        }

        presses = [...presses]
    }

    // Add flying Object

    function addObject() {
        if (flyingObjects.length < 10) {
            let x = Math.round(Math.random()*window.innerWidth)
            let y = Math.round(Math.random()*backGroundHeight)
            let z = Math.round(Math.random()*2)
            let type

            if (x > window.innerWidth - 50*backGroundHeight/762) x -=128
            if (y < 128) y += 128
            if (y > backGroundHeight*0.65) y -= 172

            if (z == 0) type ="Green"
            else if (z == 1) type = "Orange"
            else type = "Red"
            let newObject = {type: type, x: x, y: y, moved: false}
            flyingObjects = [...flyingObjects, newObject]
        }
    }

    //Shoot

    function shoot() {
        if (shootable == true) {
            shootable = false

            let x = Number(window.getComputedStyle(document.getElementById("player")).getPropertyValue("left").slice(0, -2)) + playerSizeX / 2 - backGroundHeight / 40;

            const bulletId = Date.now()
            bullets = [...bullets, { id: bulletId, color: nextBullet[0], x: x}]
            nextBullet.shift()

            player.state = nextBullet[0]

            let z = Math.round(Math.random() * 2)
            if (z == 0) nextBullet = [...nextBullet, "Green"]
            else if (z == 1) nextBullet = [...nextBullet, "Orange"]
            else nextBullet = [...nextBullet, "Red"]

            setTimeout(() => shootable = true, 2000);}
    }

    // Bullet - Object collision
    
    function bulletObjectCollission() {
        const bulletElements = document.querySelectorAll('.bullet')
        const objectElements = document.querySelectorAll('.object')

        for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
            const bulletEl = bulletElements[bulletIndex]
            const bulletRect = bulletEl.getBoundingClientRect()

            for (let objectIndex = flyingObjects.length - 1; objectIndex >= 0; objectIndex -= 1) {
                const objectEl = objectElements[objectIndex]
                const objectRect = objectEl.getBoundingClientRect()

                if (
                    bulletRect.left < objectRect.right &&
                    bulletRect.right > objectRect.left &&
                    bulletRect.top < objectRect.bottom &&
                    bulletRect.bottom > objectRect.top &&
                    bullets[bulletIndex].color === flyingObjects[objectIndex].type && 
                    gameover == false
                ) {
                    poang += 1
                    flyingObjects.splice(objectIndex, 1)
                    break
                }
            }
        }

        requestAnimationFrame(bulletObjectCollission);
    }

    // Setupp

    onMount(()=>{changePress(); setInterval(changePress, 2500); setInterval(() => addObject(),100); checkIfDamage(); updateMovment(); bulletObjectCollission();})

</script>

<main>
        <div id="presses">
            {#each presses as press}
                <img src="{pressImage}" alt="press" id="press{press.pressPos}"class="press" class:active = {press.pressPos == pressIsDown} style="bottom:{press.Bottom}px; left:{(press.pressPos/3)*100}%; width:{100/3}vw;">
            {/each}
        </div>
        <img src="assets/player/player{player.state + player.image}.png" alt="player" id="player" style="left:{player.x}px; bottom:{fromBottom + backGroundHeight/9}px; width:{80*backGroundHeight/762}px; height:{80*backGroundHeight/762}px;" class:dmgTaken={dmgTaken}>

        <div>
            {#each flyingObjects as object}
                <img src="assets/object/{object.type}Object.png" alt="" class="object" style="left:{object.x}px; top:{object.y}px; width:{48*backGroundHeight/762}px; height:{48*backGroundHeight/762};">
            {/each}
        </div>

        <div>
            {#each bullets as bullet}
                <div style="width:{backGroundHeight/20}px; height:{backGroundHeight/20}px; left:{bullet.x}px; bottom:{fromBottom + backGroundHeight/9}px; background-color:{bullet.color};" class="bullet" on:animationend={() => bullets = bullets.filter(b => b.id !== bullet.id)}></div>
            {/each}
        </div>

        <div id="hearts">
            {#each Array(player.health) as _}
                <img src="{heartImage}" alt="health item" class="heart" style="width:{64*backGroundHeight/762}px; height:{64*backGroundHeight/762};">
            {/each}
        </div>

        <p id="poang">Poäng: {poang}</p>

        {#if gameover}
            <div id="gameOver">
                <p>Du fick {poang} poäng</p>
                <a href="{base}/" id="gameOverButton">Tillbaka till startsidan</a>
            </div>
        {/if}
    <img src="{backGroundImage}" alt="The background" id="backGroundImage">
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
        transition: 900ms bottom linear;
        position: absolute;
    }

    #presses {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .active {
        transition: 900ms bottom linear;
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

    .object {
        position: fixed;
        animation: spinning 900ms linear infinite;
        z-index: -1;
    }

    @keyframes spinning {
        from{transform:rotate(0deg);}
        to{transform:rotate(360deg);}
    }

    .bullet {
        position: absolute;
        animation: moveUp 1500ms linear forwards;
        border: 4px black solid;
        z-index: -1;
    }

    @keyframes moveUp {
        to {bottom: 200vh;}
    }

    @media (max-width: 768px) {
        main {
            display: none;
        }
    }

    #poang {
        position: absolute;
        top: 48px; /* Centrera vertikalt */
        left: 50%; /* Centrera horisontellt */
        transform: translate(-50%, 0px); /* Justera för att flytta elementets mittpunkt till mitten */
        color: black;
        font-size: 2em;
        background-color: lightgreen;
        padding: 10px;
        z-index: 1;
        text-align: center; /* Centrera texten */
        border: 4px black solid;
    }

    #gameOver {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: lightgreen;
        padding: 20px;
        border: 2px solid black;
        text-align: center;
        z-index: 10;
        color: black;
    }

    #gameOverButton {
        border: 2px solid black;
    }

    #gameOverButton:hover {
        box-shadow: 0 0 10px black;
    }
</style>