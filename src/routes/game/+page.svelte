<script>

    // bilder
    import pressImage from "$lib/assets/press.png"
    import heartImage from "$lib/assets/heart.png"
    import backgroundImage from "$lib/assets/background3.png"
    import playerImage from "$lib/assets/player.png"

    // Movment

    let player = {x:10, vxl:0, vxr:0, speed:5, health:5, image: 0}

    function onKeyDown(e) {
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
        if (player.x < 0) player.x = 0
        else player.x += player.vxr - player.vxl

        if (player.x > innerWidth - 100) player.x = innerWidth - 100
        else player.x += player.vxr - player.vxl

        requestAnimationFrame(updateMovment)
    }

    updateMovment()

    // Player take damage

    let playerObject = document.querySelector("#player")


    // Player animation

    let ctx = document.getElementById 

    // press

    let presses = [{pressPos: 0, marginTop: -800}, {pressPos: 1, marginTop: -800}, {pressPos: 2, marginTop: -800}]

    let pressIsDown = 1

    function changePress() {
        pressIsDown = Math.round(Math.random()*2)
        for (let press of presses) {
            if (press.pressPos == pressIsDown) {press.marginTop = -352}
            else {press.marginTop = -800}
        }
        presses = [...presses]
    }

    setInterval(changePress, 2500)

</script>

<main>
    <div>
        <div id="presses">
            {#each presses as press}
                <img src="{pressImage}" alt="press" class="press" class:active = {press.pressPos == pressIsDown} style="margin-top:{press.marginTop}px;">
            {/each}
        </div>
        <img src="{playerImage}" alt="player" id="player" style="left:{player.x}px; top:70vh;">
    </div>
    <img src="{backgroundImage}" alt="ground" id="ground">
    <div id="hearts">
            {#each Array(player.health) as _}
                <img src="{heartImage}" alt="health item" class="heart">
            {/each}
        </div>
</main>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp}/>

<style>
    main{
        display: grid;
        height: 92vh;
        grid-template-rows:8fr 1fr;
    }

    #presses {
        display: grid;
        position: fixed;
        grid-template-columns: 1fr 1fr 1fr;
        z-index: -1;
    }

    .press {
        transition: 1000ms margin-top linear;
    }

    .active {
        transition: 1500ms margin-top linear;
    }

    #hearts {
        display: flex;
        justify-self: center;
        align-self: flex-end;
        position: fixed;
    }

    .heart {
        margin: 8px;
    }

    #player {
        position: relative;

    }

    #ground {
        position: fixed;
        z-index: -2;
    }

    @media (max-width: 1535px) {
        main {
            opacity: 0;
        }
    }
</style>