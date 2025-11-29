import random

# -------------------------------------------------
# BASE TABLES
# -------------------------------------------------

trigger_events = [
    "On-RandVar",
    "On-Set-Var",
    "On-DeclareVar",
    "On-Apply",
    "On-Negate",
    "On-Reduce",
    "On-Extend",
    "On-Spend",
    "On-Tick",
    "On-CalculateDamage",
    "On-DealDamage",
    "On-TakeDamage",
    "On-Heal",
    "On-SelectMove",
    "On-SetMove",
    "On-StartOfTurn",
    "On-TickStatuses",
    "On-TickAttunements",
    "On-CalculateSpeed",
    "On-ExecuteMove",
    "On-TurnSkipped",
    "On-GameOver",
    "On-TriggerBlessing",
    "On-EnterShop",
    "On-ExitShop",
    "On-ShopAbility",
    "On-ShopPurchase",
]

conditions = [
    "If-TurnNumber",
    "If-OverSpend",
    "If-EntityState",
    "If-MoveState",
]

entity_states = [
    "HP",
    "Max_HP",
    "Energy",
    "Max_Energy",
    "Is_Elite",
    "Is_Culture",
    "Is_Attuned_To",
    "Turns_Attuned_To",
    "Has_Status",
    "Status_Turns_Left",
    "Curse_Chance",
]

move_states = [
    "Element",
    "Speed",
    "Type",
    "Times",
    "Bound",
    "On_Cooldown",
    "Zone",
]

combat_events = {
    "Attunement":   ["Apply", "Reduce", "Spend", "Negate"],
    "Status":       ["Apply", "Reduce", "Extend", "Spend", "Negate"],
    "Energy":       ["Apply", "Reduce", "Spend", "Negate"],
    "Cooldown":     ["Apply", "Reduce", "Extend", "Negate"],
    "CurseChance":  ["Apply", "Reduce", "Negate"],
}

time_events = [
    "At_Match_Start",
    "At_Match_End",
    "At_Decide_Moves",
    "At_Calculate_Speeds",
    "At_Turn_Start",
    "At_Audit_Statuses",
    "At_Audit_Cooldowns",
    "At_Tick_Attunements",
    "At_Tick_Damage_Statuses",
    "At_Tick_Disqualifiers",
    "At_Execute_Turn",
    "At_Tick_Statuses",
    "At_Tick_Cooldowns",
    "At_Turn_End",
]

elements = [
    "water",
    "stone",
    "fire",
    "plant",
    "vital",
    "force",
    "thunder",
]

statuses = [
    "burn",
    "decay",
    "wound",
    "regen",
    "curse",
    "quick",
    "slow",
    "strong",
    "tough",
    "stun",
    "sleep",
    "anger",
]

tickables = {
    "attunement",
    "status",
    "cooldown"
}

# -------------------------------------------------
# ANSI COLORS
# -------------------------------------------------

RESET = "\033[0m"
BOLD = "\033[1m"
COLOR_TRIGGER   = "\033[91m"
COLOR_CONDITION = "\033[92m"

# -------------------------------------------------
# CONDITION BUILDING BLOCKS
# -------------------------------------------------

def cond_turn_number() -> str:
    return "If TurnNumber == X"

def cond_overspend() -> str:
    return "If OverSpend == X"

def cond_entity_state() -> str:
    who = random.choice(["Self", "Enemy"])
    state = random.choice(entity_states)
    return f"If {who}.{state} == X"

def cond_move_state() -> str:
    target = random.choice(["Move", "EnemyMove"])
    state = random.choice(move_states)
    return f"If {target}.{state} == X"

def cond_damage_element() -> str:
    return "If Damage_Element == X"

def cond_damage_amount() -> str:
    return "If Damage_Amount == X"

def cond_shop_state() -> str:
    shop_states = [
        "Shop.UseAbility",
        "Shop.MakePurchase",
        "Shopkeeper.Culture",
    ]
    # allow OverSpend only in purchase context; still printed as a shop condition
    if random.random() < 0.2:
        return "If Purchase.OverSpend == X"
    return f"If {random.choice(shop_states)} == X"

# -------------------------------------------------
# TRIGGER CATEGORIES
# -------------------------------------------------

entity_op_triggers = {
    "On-Apply",
    "On-Negate",
    "On-Reduce",
    "On-Extend",
    "On-Spend",
    "On-Tick",
}

move_triggers = {
    "On-SelectMove",
    "On-SetMove",
    "On-ExecuteMove",
}

damage_triggers = {
    "On-CalculateDamage",
    "On-DealDamage",
    "On-TakeDamage",
}

heal_triggers = {
    "On-Heal",
}

time_triggers = {
    "On-StartOfTurn",
    "On-TickStatuses",
    "On-TickAttunements",
    "On-TurnSkipped",
}

shop_triggers = {
    "On-EnterShop",
    "On-ExitShop",
    "On-ShopAbility",
    "On-ShopPurchase",
}

numeric_triggers = {
    "On-RandVar",
    "On-Set-Var",
    "On-DeclareVar",
    "On-CalculateSpeed",
}

meta_triggers = {
    "On-GameOver",
    "On-TriggerBlessing",
}

spending_triggers = {
    "On-Spend",
    "On-ShopPurchase",
}

event_op_map = {
    "On-Apply": "Apply",
    "On-Reduce": "Reduce",
    "On-Extend": "Extend",
    "On-Spend": "Spend",
    "On-Negate": "Negate",
}

def pick_resource_for_operation(op: str) -> str:
    valid = [res for res, ops in combat_events.items() if op in ops]
    return random.choice(valid)

# -------------------------------------------------
# PER-CATEGORY ROW GENERATORS
# Each returns (trigger_label, condition_string)
# -------------------------------------------------

def generate_entity_row(trigger: str) -> tuple[str, str]:
    # On-Tick must print a tickable
    if trigger == "On-Tick":
        tick_target = random.choice(sorted(tickables)).capitalize()
        trigger_label = f"{trigger} {tick_target}"
        cond = random.choice([cond_turn_number, cond_entity_state])()
        return trigger_label, cond
    # Apply / Reduce / Extend / Spend / Negate must print a resource
    op = event_op_map[trigger]
    res = pick_resource_for_operation(op)
    trigger_label = f"{trigger} {res}"
    # Only spend-related events can use OverSpend
    if trigger == "On-Spend":
        cond_func = random.choice([ cond_overspend, cond_entity_state, cond_turn_number ])
    else:
        cond_func = random.choice([ cond_entity_state, cond_turn_number ])
    return trigger_label, cond_func()

def generate_move_row(trigger: str) -> tuple[str, str]:
    cond_func = random.choice([
        cond_move_state,
        cond_entity_state,
        cond_turn_number
    ])
    return trigger, cond_func()

def generate_shop_row(trigger: str) -> tuple[str, str]:
    return trigger, cond_shop_state()

def generate_damage_row(trigger: str) -> tuple[str, str]:
    cond_func = random.choice([
        cond_damage_element,
        cond_damage_amount,
        cond_entity_state,
        cond_turn_number
    ])
    return trigger, cond_func()

def generate_heal_row(trigger: str) -> tuple[str, str]:
    cond_func = random.choice([ cond_entity_state, cond_turn_number ])
    return trigger, cond_func()

def generate_time_row(trigger: str) -> tuple[str, str]:
    if trigger == "On-TickAttunements":
        return trigger, "If Self.Turns_Attuned_To == X"
    if trigger == "On-TickStatuses":
        return trigger, "If Self.Status_Turns_Left == X"
    cond_func = random.choice([ cond_turn_number, cond_entity_state ])
    return trigger, cond_func()

def generate_numeric_row(trigger: str) -> tuple[str, str]:
    # On-RandVar: metadata only (no move state)
    if trigger == "On-RandVar":
        cond_func = random.choice([ cond_turn_number, cond_entity_state ])
    else: cond_func = random.choice([ cond_turn_number, cond_entity_state, cond_move_state ])
    return trigger, cond_func()

def generate_meta_row(trigger: str) -> tuple[str, str]:
    cond_func = random.choice([ cond_entity_state, cond_turn_number ])
    return trigger, cond_func()

# -------------------------------------------------
# TOP-LEVEL ROW
# -------------------------------------------------

def generate_condition_row() -> tuple[str, str]:
    trigger = random.choice(trigger_events)

    if trigger in entity_op_triggers:   return generate_entity_row(trigger)
    if trigger in move_triggers:        return generate_move_row(trigger)
    if trigger in shop_triggers:        return generate_shop_row(trigger)
    if trigger in damage_triggers:      return generate_damage_row(trigger)
    if trigger in heal_triggers:        return generate_heal_row(trigger)
    if trigger in time_triggers:        return generate_time_row(trigger)
    if trigger in numeric_triggers:     return generate_numeric_row(trigger)
    if trigger in meta_triggers:        return generate_meta_row(trigger)
    # Fallback, should not be hit
    return trigger, cond_turn_number()

# -------------------------------------------------
# DRIVER (TABLE OUTPUT)
# -------------------------------------------------

def main(n: int = 30) -> None:
    rows: list[tuple[str, str]] = [generate_condition_row() for _ in range(n)]

    # Compute column widths (without color codes)
    trigger_header = "Trigger"
    condition_header = "Condition"

    max_trigger_len = max(len(trigger_header), *(len(t) for t, _ in rows))
    # condition width not strictly needed for alignment, but we use header len
    max_condition_len = max(len(condition_header), *(len(c) for _, c in rows))

    # Header
    sep = "-" * max_trigger_len + "-+-" + "-" * max_condition_len
    print(f"{BOLD}{trigger_header.ljust(max_trigger_len)} | {condition_header}{RESET}")
    print(sep)

    # Rows
    for trigger, condition in rows:
        trigger_col = f"{COLOR_TRIGGER}{trigger.ljust(max_trigger_len)}{RESET}"
        condition_col = f"{COLOR_CONDITION}{condition}{RESET}"
        print(f"{trigger_col} | {condition_col}")

if __name__ == "__main__":
    main()


