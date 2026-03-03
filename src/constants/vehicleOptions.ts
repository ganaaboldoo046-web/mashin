export interface VehicleOption {
    id: string;
    label: string;
    icon: string; // Material Symbol name
    category: 'exterior' | 'safety' | 'convenience' | 'seat';
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
    // --- Exterior / Interior (Гадаад / Дотоод) ---
    { id: 'sunroof', label: 'Лүүк', icon: 'roofing', category: 'exterior' }, // originally Сэнлүүф
    { id: 'led_headlight', label: 'Урд гэрэл (HID, LED)', icon: 'light', category: 'exterior' },
    { id: 'power_trunk', label: 'Автомат багаажны хаалга', icon: 'sensor_door', category: 'exterior' },
    { id: 'soft_close', label: 'Хаалга сорогч', icon: 'sensor_window', category: 'exterior' }, // originally Смарт хаалга хаагч
    { id: 'power_folding_mirrors', label: 'Цахилгаан эвхэгддэг толь', icon: 'flip', category: 'exterior' }, // custom?
    { id: 'alloy_wheels', label: 'Хайлшин обуд', icon: 'tire_repair', category: 'exterior' },
    { id: 'roof_rail', label: 'Дээврийн рейл', icon: 'check_box_outline_blank', category: 'exterior' }, // generic rail
    { id: 'heated_steering', label: 'Руль халаагч', icon: 'sports_motorsports', category: 'exterior' },
    { id: 'adjustable_steering', label: 'Өндөр/нам тохируулга', icon: 'settings_accessibility', category: 'exterior' },
    { id: 'paddle_shift', label: 'Падл шифт', icon: 'tune', category: 'exterior' },
    { id: 'steering_controls', label: 'Жолооны удирдлага', icon: 'gamepad', category: 'exterior' },
    { id: 'auto_door_lock', label: 'Автомат түгжээ', icon: 'lock', category: 'exterior' },
    { id: 'high_pass', label: 'High-pass шүүлтүүр', icon: 'wysiwyg', category: 'exterior' },
    { id: 'power_steering', label: 'Автомат', icon: 'toys', category: 'exterior' },
    { id: 'auto_window', label: 'Автомат цонх', icon: 'calendar_view_day', category: 'exterior' },
    { id: 'ecm_mirror', label: 'ECM толь', icon: 'nightlight', category: 'exterior' },

    // --- Safety (Аюулгүй байдал) ---
    { id: 'airbag_driver', label: 'Airbag (жолооч, зорчигч)', icon: 'airline_seat_recline_normal', category: 'safety' },
    { id: 'airbag_side', label: 'Хажуугийн агаарын дэр', icon: 'airline_seat_recline_extra', category: 'safety' },
    { id: 'airbag_curtain', label: 'Хөшиг агаарын дэр', icon: 'curtains', category: 'safety' },
    { id: 'abs', label: 'ABS тоормос', icon: 'verified_user', category: 'safety' },
    { id: 'tcs', label: 'TCS гулсалтын эсрэг', icon: 'terrain', category: 'safety' },
    { id: 'esc', label: 'ESC тогтворжилт', icon: 'timeline', category: 'safety' },
    { id: 'tpms', label: 'TPMS дугуйн даралт', icon: 'tire_repair', category: 'safety' },
    { id: 'ldws', label: 'LDWS эгнээ мэдрэгч', icon: 'alt_route', category: 'safety' },
    { id: 'ecs', label: 'ECS электрон түдгэлзүүлэлт', icon: 'graphic_eq', category: 'safety' },
    { id: 'parking_sensor', label: 'Зогсоолын мэдрэгч', icon: 'sensors', category: 'safety' },
    { id: 'rear_collision', label: 'Арын мөргөлдөөн', icon: 'contact_support', category: 'safety' },
    { id: 'rear_camera', label: 'Арын камер', icon: 'videocam', category: 'safety' },
    { id: 'camera_360', label: '360° камер', icon: '360', category: 'safety' },

    // --- Comfort / Multimedia (Тав тух / Мультимедиа) ---
    { id: 'cruise_control', label: 'Круиз контроль', icon: 'speed', category: 'convenience' },
    { id: 'hud', label: 'HUD дэлгэц', icon: 'monitor', category: 'convenience' },
    { id: 'epb', label: 'EPB гар тоормос', icon: 'pan_tool', category: 'convenience' },
    { id: 'auto_ac', label: 'Автомат агааржуулагч', icon: 'ac_unit', category: 'convenience' },
    { id: 'smart_key', label: 'Смарт түлхүүр', icon: 'key', category: 'convenience' }, // or 'remote_gen'
    { id: 'wireless_lock', label: 'Утасгүй түгжээ', icon: 'wifi_lock', category: 'convenience' },
    { id: 'rain_sensor', label: 'Борооны мэдрэгч', icon: 'water_drop', category: 'convenience' },
    { id: 'fog_light', label: 'Ослын гэрэл', icon: 'foggy', category: 'convenience' },
    { id: 'sun_shade', label: 'Нарны хаалт/хөшиг', icon: 'blinds', category: 'convenience' },
    { id: 'navigation', label: 'Навигаци', icon: 'map', category: 'convenience' },
    { id: 'av_front', label: 'Урд AV дэлгэц', icon: 'smart_display', category: 'convenience' },
    { id: 'av_rear', label: 'Арын AV дэлгэц', icon: 'tv', category: 'convenience' },
    { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', category: 'convenience' },
    { id: 'cd_player', label: 'CD тоглуулагч', icon: 'album', category: 'convenience' },
    { id: 'usb', label: 'USB оролт', icon: 'usb', category: 'convenience' },
    { id: 'aux', label: 'AUX оролт', icon: 'cable', category: 'convenience' },

    // --- Seat (Суудал) ---
    { id: 'leather_seat', label: 'Арьсан суудал', icon: 'chair', category: 'seat' },
    { id: 'power_seat_front', label: 'Цахилгаан суудал (Урд)', icon: 'airline_seat_recline_normal', category: 'seat' },
    { id: 'power_seat_rear', label: 'Цахилгаан суудал (Арын)', icon: 'airline_seat_recline_extra', category: 'seat' },
    { id: 'heated_seat_front', label: 'Суудал халаагч (урд)', icon: 'mode_heat', category: 'seat' },
    { id: 'heated_seat_rear', label: 'Суудал халаагч (хойд)', icon: 'mode_heat', category: 'seat' },
    { id: 'vent_seat_front', label: 'Суудал сэрүүцүүлэгч (урд)', icon: 'air', category: 'seat' },
    { id: 'vent_seat_rear', label: 'Суудал сэрүүцүүлэгч (хойд)', icon: 'air', category: 'seat' },
    { id: 'memory_seat', label: 'Санах ойтой суудал', icon: 'memory', category: 'seat' },
    { id: 'massage_seat', label: 'Массажтай суудал', icon: 'spa', category: 'seat' },
];

export const OPTION_CATEGORIES = {
    exterior: 'Гадаад / Дотоод',
    safety: 'Аюулгүй байдал',
    convenience: 'Тав тух / Мультимедиа',
    seat: 'Суудал'
};
