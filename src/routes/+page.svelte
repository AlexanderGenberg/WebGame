<script>
    let backGroundImage = "assets/background3.png"

    import { base } from '$app/paths';
</script>

<main>
    <img src="{backGroundImage}" alt="The background" id="backGroundImage">
    <div id="tutorial">
        <p>Knappar:</p>
        <p>D & "höger pil" för att röra sig höger</p>
        <p>A & "vänster pil" för att röra sig vänster</p>
        <p>Mellanslag för att skjuta</p>
        <p>Målet:</p>
        <p>Samla poäng genom att skjuta på flygande skräp</p>
        <p>Nästa skott du skjuter får samma färg som spelaren</p>
        <p>Man måste träffa skräp med samma färg som skottet</p>
        <p>Undvik att bli pressad</p>
    </div>
    <a href="{base}/game" id="startButton">Start Game</a>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #backGroundImage {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1; /* Ensure the image is behind other content */
    }

    #startButton {
        font-size: 2em;
        color: black;
        height: 32px;
        border: 2px solid black;
    }

    #startButton:hover {
        background-color: white;
    }

    #tutorial {
        font-size: 1.5em;
        color: black;
        margin-top: 20px;
        text-align: center;
    }
    #tutorial p {
        margin: 5px 0;
    }
</style>