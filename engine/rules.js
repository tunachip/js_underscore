/* ====================================
	engine/rules.js
	
	
	
  ==================================== */
import Element from engine.enums


// DamageResults
export const Absorb = (heal=1) => ({ type: "Absorb", heal });
export const Modify = (deal)	 =>	({ type: "Modify", deal });
export const Immune = ()			 => ({ type: "Immune" });

// TupleKey for DamageRules
const k = (a, b) = `${a}|${b}`;

export const DamageRules = {
//[k(Damage.Element,  Target.Attune)]:	 [Effect()]
	// -- Water ----------------------------------------
	[k(Element.FIRE,	  Element.WATER)]:   [Absorb()],
	[k(Element.STONE,	  Element.WATER)]:   [Modify(-1)],
	[k(Element.PLANT,	  Element.WATER)]:   [Modify(+1)],
	[k(Element.THUNDER, Element.WATER)]:   [Modify(+1)],
	// -- Stone ----------------------------------------
	[k(Element.WATER,	  Element.STONE)]:   [Modify(+1)],
	[k(Element.FIRE,	  Element.STONE)]:   [Modify(-1)],
	[k(Element.FORCE,	  Element.STONE)]:   [Modify(+1)],
	[k(Element.THUNDER, Element.STONE)]:   [Immune()],
	// -- Fire -----------------------------------------
	[k(Element.WATER,	  Element.FIRE)]:    [Modify(+1)],
	[k(Element.STONE,	  Element.FIRE)]:    [Immune(+1)],
	[k(Element.PLANT,	  Element.FIRE)]:    [Absorb()],
	// -- Plant ----------------------------------------
	[k(Element.WATER,	  Element.PLANT)]:   [Absorb()],
	[k(Element.FIRE,	  Element.PLANT)]:   [Modify(+1)],
	[k(Element.VITAL,	  Element.PLANT)]:   [Modify(+1)],
	// -- Vital ----------------------------------------
	[k(Element.PLANT,	  Element.VITAL)]:   [Modify(-1)],
	[k(Element.VITAL,	  Element.VITAL)]:   [Modify(+1)],
	[k(Element.FORCE,	  Element.VITAL)]:   [Modify(+1)],
	// -- Force ----------------------------------------
	[k(Element.STONE,	  Element.FORCE)]:	 [Immune()],
	[k(Element.VITAL,	  Element.FORCE)]:	 [Modify(-1)],
	[k(Element.THUNDER, Element.FORCE)]:   [Modify(+1)],
	// -- Thunder --------------------------------------
	[k(Element.WATER,	  Element.THUNDER)]: [Modify(-1)],
	[k(Element.STONE,		Element.THUNDER)]: [Modify(+1)],
	[k(Element.FORCE,		Element.THUNDER)]: [Immune()],
	// -------------------------------------------------
};

