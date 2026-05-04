$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.study-button').click(clickedStudy);
    $('.doom-scroll-button').click(clickedDoomScrollButton);
    $('.instructionOverlay').click(toggleInstructionsPopup);
    setInterval(movePetRandomly, 5000);
}); 
    const turtwigSound = document.getElementById("turtwigSound");
    const grovyleSound = document.getElementById("grovyleSound");
    const torterraSound = document.getElementById("torterraSound"); 
    const charmanderSound = document.getElementById("charmanderSound");
    const charmeleonSound = document.getElementById("charmeleonSound");
    const charizardSound = document.getElementById("charizardSound");
    //Pokemon class to create new pokemon objects with name, weight, happiness, and iq properties
    class Pokemon {
      constructor(speciesName, stages) {
        this.speciesName = speciesName;
        this.stages = stages;
        this.name = "My Pet Name";
        this.weight = "??";
        this.happiness = "??";
        this.iq = "??";
        this.stage = 1;
        this.caught = false;
      }
    }

    const pokemonList = [
      new Pokemon("Turtwig", [
        { name: "Turtwig", img: "./images/TurtwigWalk.png", sound: turtwigSound },
        { name: "Grotle", img: "./images/Grotle.jpg", sound: grovyleSound },
        { name: "Torterra", img: "./images/Torterra.png", sound: torterraSound }
      ]),

      new Pokemon("Charmander", [
        { name: "Charmander", img: "./images/charmander.png", sound: charmanderSound },
        { name: "Charmeleon", img: "./images/charmeleon.png", sound: charmeleonSound },
        { name: "Charizard", img: "./images/charizard.png", sound: charizardSound }
      ])
    ];

    let currentPokemonIndex = 0;
    let currentPokemon = pokemonList[currentPokemonIndex];

    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    let pet_info = pokemonList[currentPokemonIndex];

    const bgMusic = document.getElementById("bgMusic");

    //Flag to prevent multiple throws at once
    let animation = false; 

    //Display Mood in Activity Logs
    function getMoodComment(action = "") {
      const h = pet_info.happiness;
      const w = pet_info.weight;
      const iq = pet_info.iq;

      if (h >= 85 && iq >= 70) return "is glowing with confidence!";
      if (h >= 80) return "is zooming around with excitement!";
      if (h <= 20) return "looks really upset...";
      if (w <= 10) return "has a tiny stomach growl going on.";
      if (w >= 80) return "looks extra round and sleepy.";
      if (iq >= 85) return "looks like a genius right now.";
      if (iq <= 20) return "has absolutely no thoughts right now.";
      if (h <= 35 && iq >= 70) return "looks smart, but mentally exhausted.";
      if (h >= 60 && w >= 50) return "looks cozy and content.";
      
      if (action === "play") return "is having the time of its life!";
      if (action === "exercise") return "looks tired, but proud!";
      if (action === "study") return "is locked in.";
      if (action === "treat") return "looks very satisfied.";
      if (action === "doomscroll") return "looks entertained but unfocused.";

      return "is just vibing.";
    }

    function switchPokemon() {
      if (animation) return;
      animation = true;

      const ball = $('#pokeball');
      const pet = $('.pet-image');

      //Return current Pokémon to ball
      ball.addClass('caught');
      pet.addClass('caught-pet');

      setTimeout(() => {
        //Switch Pokémon
        currentPokemonIndex = (currentPokemonIndex + 1) % pokemonList.length;
        pet_info = pokemonList[currentPokemonIndex];

        // Update image BEFORE releasing
        pet.attr('src', pet_info.stages[pet_info.stage - 1].img);

        //Release new Pokémon
        ball.removeClass('caught');
        pet.removeClass('caught-pet');

        //play sound when coming out
        const stageData = pet_info.stages[pet_info.stage - 1];
        if (stageData.sound) {
          stageData.sound.currentTime = 0;
          stageData.sound.volume = 0.3;
          stageData.sound.play();
        }

        updatePetInfoInHtml();
        //Show current party
        showPartyTable();
        if(pet_info.caught) {
          addStatusUpdate(`Go! ${pet_info.name}!`);
        } else {
          addStatusUpdate(`A wild ${pet_info.speciesName} appeared!`);
        }
        animation = false;
      }, 800);
    }

    function evolvePokemon() {
      const stageData = pet_info.stages[pet_info.stage - 1];

      if (stageData.sound) {
        stageData.sound.currentTime = 0;
        stageData.sound.volume = 0.3;
        stageData.sound.play();
      }
      
      $('.pet-image').fadeOut(1000, function() {
        $(this).attr('src', stageData.img).fadeIn(1000);

        addStatusUpdate(`What?! ${pet_info.name} is evolving!`);
        addStatusUpdate(`It evolved into ${stageData.name}!`);
      });
    }

    //Evolve Pokemone based on stats
    function checkEvolution() {
      if (pet_info.iq >= 50 && pet_info.happiness >= 50 && pet_info.weight >= 10 && pet_info.stage === 1) {
        pet_info.stage = 2;
        evolvePokemon();
      }

      if (pet_info.iq >= 70 && pet_info.happiness >= 70 && pet_info.weight >= 30 && pet_info.stage === 2) {
        pet_info.stage = 3;
        evolvePokemon();
      }
    }

    // Function to toggle the visibility of the popup and dim the status log
    function togglePopup() {
      const overlay = document.getElementById('popupOverlay');

      // Toggle the 'log-dimmed' class on the status container to dim it when the popup is active
      $('.status-container').toggleClass('log-dimmed');
      overlay.classList.toggle('show');
    }

    function toggleInstructionsPopup() {
      const overlay = document.getElementById('instructionOverlay');
      $('.status-container').toggleClass('log-dimmed');
      overlay.classList.toggle('show');
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            toggleInstructionsPopup();
        }
      });

    }

    // Function to handle the submission of the pet's name from the popup
    function submitInput() {
      const val = document.getElementById('myInput').value;

      //Create error message if the input is empty and prevent submission
      if(val.trim() === "") {
        document.getElementById('nameError').textContent = "Please enter a name for your pet.";
        //Log error message to console when empty input is submitted
        console.log("Enter a name thats not empty");
        return;
      }

      //Set current pet_info name to value of input
      pet_info.name = val;
      pet_info.caught = true;
      
      createPetInfo();
      updatePetInfoInHtml();

      // Close after submit
      togglePopup();
      // Clear input and error message for next time
      document.getElementById('myInput').value = '';
      document.getElementById('nameError').textContent = '';
    }

    // Function to handle throwing the Pokéball
    function throwPokeball() {
      if (bgMusic.paused) {
        bgMusic.volume = 0.1;
        bgMusic.play();
      }
      // If an animation is already in progress, do not allow another throw
      if (animation) return; 

      animation = true;

      const sound = document.getElementById("pokeballSound");
      sound.volume = 0.3;
      const ball = $('#pokeball');
      const pet = $('.pet-image');

      //toggleClass used to turn on and off a class
      // If the pet's name is still the default, trigger the catch sequence
      if(!pet_info.caught) {

        //Toggle Shake Animation and add status update
        ball.toggleClass('shake');
        sound.currentTime = 0; // restart sound if spam clicked
        sound.play();
        addStatusUpdate("You threw a Pokéball!");

        //After the shake (1.5s), catch the pet
        setTimeout(() => {
          //toggle caught classes to show pet is caught and add status update
          ball.toggleClass('shake');
          ball.toggleClass('caught');
          pet.toggleClass('caught-pet');

          pet_info.caught = true;
          
          addStatusUpdate(`Gotcha! ${pet_info.speciesName} was caught!`);

          //Show the dashboard after the catch is confirmed
          $('.dashboard').removeClass('hidden');
          $('.button-container').removeClass('hidden');

          setTimeout(() => {
            togglePopup(); 
          }, 500);
          // Reset animation flag after the entire sequence is done
          animation = false; 
        }, 3250);
      }
      // If the pet is already caught, toggle back to release it
      else {
        ball.toggleClass('caught');
        pet.toggleClass('caught-pet');

        // play current pokemon sound when it comes out
        const stageData = pet_info.stages[pet_info.stage - 1];

        if (stageData.sound) {
          stageData.sound.currentTime = 0;
          stageData.sound.volume = 0.3;
          stageData.sound.play();
        }

        // Add status update based on whether the pet is being released or caught again
        if(ball.hasClass('caught')) {
          addStatusUpdate(`<b>Come back! ${pet_info.name}!`);
        } else {
          if(!pet_info.caught) {
            addStatusUpdate(`<b>Go! ${pet_info.speciesName}!`);
          } else {
            addStatusUpdate(`<b>Go! ${pet_info.name}!`);
          }
        }

        // Face right by default when released
        pet.css('transform', 'scaleX(1.2)'); 
        setTimeout(() => {
          // Reset pet scale and animation flag after release
          animation = false;
          pet.css('transform', 'scaleX(1)');
        }, 500);
      }
    }

 
    // Function to move the pet to a random position within the container every 5 seconds
    function movePetRandomly() {
      const container = $('.pet-image-container');
      const pet = $('.pet-image');

      const containerWidth = container.width();
      const containerHeight = container.height();
      const petWidth = pet.width();
      const petHeight = pet.height();

      // Calculate random positions (keeping pet on the grass)
      const randomTop = Math.floor(Math.random() * (containerHeight/2 - petHeight) + containerHeight/2);
      const randomLeft = Math.floor(Math.random() * (containerWidth - petWidth));

      // Flip the pet to face the direction it's moving
      if(randomLeft < pet.position().left) {
        pet.css('transform', 'scaleX(1)'); // Face right
      } else {
        pet.css('transform', 'scaleX(-1)'); // Face left
      }

      // Apply the new position
      pet.css({
        'top': randomTop + 'px',
        'left': randomLeft + 'px'
      });
    }

    //Create new pet info w/ random weight, happiness, and iq when name is submitted
    function createPetInfo() {
      pet_info.happiness = Math.floor(Math.random() * (50 - 0)) + 0;
      pet_info.weight = Math.floor(Math.random() * (50 - 0)) + 0;
      pet_info.iq = Math.floor(Math.random() * (50 - 0)) + 0;
      pet_info.stage = 1;
    }

    // Treat button increases happiness and weight
    function clickedTreatButton() {
      pet_info.happiness++;
      pet_info.weight++;
      addStatusUpdate(`${pet_info.name} ate a snack!`);
      addStatusUpdate(`${pet_info.name} ${getMoodComment("treat")}`);
      checkAndUpdatePetInfoInHtml();
    }
    
    // Play button increases happiness and decreases weight
    function clickedPlayButton() {
      pet_info.happiness++;
      pet_info.weight--;
      addStatusUpdate(`${pet_info.name} played their favorite game!`);
      addStatusUpdate(`${pet_info.name} ${getMoodComment("play")}`);
      checkAndUpdatePetInfoInHtml();
    }
    
    // Exercise button decreases happiness and weight
    function clickedExerciseButton() {
      pet_info.happiness--;
      pet_info.weight--;
      addStatusUpdate(`${pet_info.name} trained hard!`);
      addStatusUpdate(`${pet_info.name} ${getMoodComment("exercise")}`);
      checkAndUpdatePetInfoInHtml();
    }

    // Doom Scroll button decreases iq and increases happiness
    function clickedDoomScrollButton() {
      pet_info.iq--;
      pet_info.happiness++;
      addStatusUpdate(`${pet_info.name} doom scrolled on social media!`);
      addStatusUpdate(`${pet_info.name} ${getMoodComment("doomscroll")}`);
      checkAndUpdatePetInfoInHtml();
    }

    // Study button increases iq and decreases happiness
    function clickedStudy() {
      pet_info.iq++;
      pet_info.happiness--;
      addStatusUpdate(`${pet_info.name} studied hard!`);
      addStatusUpdate(`${pet_info.name} ${getMoodComment("study")}`);
      checkAndUpdatePetInfoInHtml();
    }

    // Function to add a new status update to the top of the status log
    function addStatusUpdate(message) {
      // Prepend (add to the top) a new paragraph with the message to the status log
      $('#status-log').prepend(`<br/><p> > ${message}</p>`);
    }
  
    // Function to check weight and happiness values before updating the HTML to ensure they do not go below 0, then update the HTML with the current pet info
    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessBeforeUpdating();
      checkEvolution();
      updatePetInfoInHtml();
      if(!pet_info.caught) {
        addStatusUpdate(`Catch the wild Pokemon`);
      }
    }
    
    function checkWeightAndHappinessBeforeUpdating() {
      // Ensure weight, happiness, and iq do not go below 0
      if (pet_info.weight < 0) {
        pet_info.weight = 0;
      }

      if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
      }

      if(pet_info.iq < 0) {
        pet_info.iq = 0;
      }
    }
    
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info.name);
      $('.weight').text(pet_info.weight);
      $('.happiness').text(pet_info.happiness);
      $('.iq').text(pet_info.iq);
      $('.mood').text(getMoodComment());
    }

    //Log Info
    function logInfo() {
      console.log(`Name: ${pet_info.name}`);
      console.log(`Weight: ${pet_info.weight}`);
      console.log(`Happiness: ${pet_info.happiness}`);
      console.log(`IQ: ${pet_info.iq}`);
    }
    
    //Log Table
    function showPartyTable() {
      console.table(
        pokemonList
        //Filters pokemonList to show only caught pokemon
          .filter(pokemon => pokemon.caught)
          //Maps caught pokemon to a spot in the table with pet info
          .map((pokemon, index) => ({
            Slot: index + 1,
            Species: pokemon.stages[pokemon.stage - 1].name,
            Name: pokemon.name,
            Weight: pokemon.weight,
            Happiness: pokemon.happiness,
            IQ: pokemon.iq,
            Stage: pokemon.stage,
          }))
      );
    }

    //Log Group
    function currentParty() {
      //Grouping console logs together to show current party of pokemon with their names. If no pokemon caught, show error message in console instead.
      console.group("Current Party");
      if(pokemonList.filter(pokemon => pokemon.caught).length === 0) {
        console.error("No Pokemon caught yet!");
      } else {
        pokemonList.forEach((pokemon, index) => {
          console.log(`${pokemon.name}`);
        });
      }
      console.groupEnd();
    }

    //Custom Log
    function logCustom() {
      console.log(
        '%c🔥 Pokemon Ready!',
        "font-family: 'PokemonHollow'; font-size: 20px; color: white; background: darkblue; padding: 6px;"
      );
    }

    //404 Error Log
    function logError() {
      fetch('/pokemon-data');
    }

    //Cause Error
    function causeError() {
      document.querySelector('#pokemonMaster').textContent = "Congratulations, you are now a Pokemon Master!";
    }

    //Violation Error
    function violationError() {
      const duration = 3000;
      const start = new Date().getTime();
      while (new Date().getTime() < start + duration) {
        // Block the main thread for 3 seconds.
      }
    }

    