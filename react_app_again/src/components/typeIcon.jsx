import React from "react";
import bugIcon from "../assets/pokemonTypes/bug.svg";
import darkIcon from "../assets/pokemonTypes/dark.svg";
import dragonIcon from "../assets/pokemonTypes/dragon.svg";
import electricIcon from "../assets/pokemonTypes/electric.svg";
import fairyIcon from "../assets/pokemonTypes/fairy.svg";
import fightingIcon from "../assets/pokemonTypes/fighting.svg";
import fireIcon from "../assets/pokemonTypes/fire.svg";
import flyingIcon from "../assets/pokemonTypes/flying.svg";
import ghostIcon from "../assets/pokemonTypes/ghost.svg";
import grassIcon from "../assets/pokemonTypes/grass.svg";
import groundIcon from "../assets/pokemonTypes/ground.svg";
import iceIcon from "../assets/pokemonTypes/ice.svg";
import normalIcon from "../assets/pokemonTypes/normal.svg";
import poisonIcon from "../assets/pokemonTypes/poison.svg";
import psychicIcon from "../assets/pokemonTypes/psychic.svg";
import rockIcon from "../assets/pokemonTypes/rock.svg";
import steelIcon from "../assets/pokemonTypes/steel.svg";
import waterIcon from "../assets/pokemonTypes/water.svg";

const typeIcons = {
  bug: bugIcon,
  dark: darkIcon,
  dragon: dragonIcon,
  electric: electricIcon,
  fairy: fairyIcon,
  fighting: fightingIcon,
  fire: fireIcon,
  flying: flyingIcon,
  ghost: ghostIcon,
  grass: grassIcon,
  ground: groundIcon,
  ice: iceIcon,
  normal: normalIcon,
  poison: poisonIcon,
  psychic: psychicIcon,
  rock: rockIcon,
  steel: steelIcon,
  water: waterIcon
};

const TypeIcon = ({ type, className = "" }) => {
    const iconSrc = typeIcons[type?.toLowerCase()] || typeIcons.normal;
    
    return (
      <img 
        src={iconSrc} 
        alt={`${type} type`} 
        className={`w-6 h-6 ${className}`} 
      />
    );
  };
  
  export default TypeIcon;