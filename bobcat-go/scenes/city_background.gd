extends ParallaxLayer

@export var base_speed: float = 500.0
@export var max_speed: float = 1500.0
@export var acceleration: float = 20.0

var current_speed: float
var scroll_x: float = 0.0

func _ready() -> void:
	current_speed = base_speed

func _process(delta: float) -> void:
	current_speed = min(current_speed + acceleration * delta, max_speed)
	scroll_x -= current_speed * delta
	# Wrap within the mirroring width so it loops seamlessly
	if motion_mirroring.x > 0:
		scroll_x = fmod(scroll_x, motion_mirroring.x)
	motion_offset.x = scroll_x
