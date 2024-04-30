const EquipmentType = {
"EnumEquipmentType.0.Text":"Unknown",
"EnumEquipmentType.1.Text":"Air Handler",
"EnumEquipmentType.2.Text":"AHU",
"EnumEquipmentType.3.Text":"BACnet Device",
"EnumEquipmentType.4.Text":"Blower Coil",
"EnumEquipmentType.5.Text":"Chilled Ceiling",
"EnumEquipmentType.6.Text":"Chiller",
"EnumEquipmentType.7.Text":"Chiller Plant",
"EnumEquipmentType.8.Text":"Fan Coil",
"EnumEquipmentType.9.Text":"Fan Coil",
"EnumEquipmentType.10.Text":"Generic",
"EnumEquipmentType.11.Text":"Heat Pump",
"EnumEquipmentType.12.Text":"Heat Pump Loop",
"EnumEquipmentType.13.Text":"MP580/581",
"EnumEquipmentType.14.Text":"PCM",
"EnumEquipmentType.15.Text":"Radiator",
"EnumEquipmentType.16.Text":"Rooftop",
"EnumEquipmentType.17.Text":"RTU",
"EnumEquipmentType.18.Text":"Self-Contained",
"EnumEquipmentType.19.Text":"Two Heat Two Cool",
"EnumEquipmentType.20.Text":"Unit Ventilator",
"EnumEquipmentType.21.Text":"UPCM",
"EnumEquipmentType.22.Text":"Variable Air System",
"EnumEquipmentType.23.Text":"VariTrac System",
"EnumEquipmentType.24.Text":"VAV",
"EnumEquipmentType.25.Text":"TCM",
"EnumEquipmentType.26.Text":"Modem",
"EnumEquipmentType.27.Text":"Electric",
"EnumEquipmentType.28.Text":"Thermal Energy",
"EnumEquipmentType.29.Text":"Gaseous Flow",
"EnumEquipmentType.30.Text":"Liquid Flow",
"EnumEquipmentType.32.Text":"Indoor Unit",
"EnumEquipmentType.33.Text":"Outdoor Unit",
"EnumEquipmentType.34.Text":"Branch Controller",
"EnumEquipmentType.35.Text":"Remote Controller",
"EnumEquipmentType.36.Text":"Energy Recovery Ventilator",
"EnumEquipmentType.37.Text":"Heat Exchanger",
"EnumEquipmentType.38.Text":"Generic VRF Controller",
"EnumEquipmentType.41.Text":"VFD",
"EnumEquipmentType.42.Text":"Fan",
"EnumEquipmentType.43.Text":"Pump",
"EnumEquipmentType.44.Text":"Pump Bank",
"EnumEquipmentType.45.Text":"Cooling Tower",
"EnumEquipmentType.46.Text":"Cooling Tower Cell",
"EnumEquipmentType.47.Text":"Distribution Loop",
"EnumEquipmentType.48.Text":"Heating",
"EnumEquipmentType.49.Text":"Domestic",
"EnumEquipmentType.50.Text":"Steam",
"EnumEquipmentType.51.Text":"Generic",
"EnumEquipmentType.52.Text":"Chilled Water",
"EnumEquipmentType.53.Text":"Condenser Water",
"EnumEquipmentType.54.Text":"Hot Water",
"EnumEquipmentType.55.Text":"Generic",
"EnumEquipmentType.56.Text":"Centrifugal"
}

const HeatCoolMode = {
    "Mode.0.Text":"Off",
    "Mode.1.Text":"Heat",
    "Mode.2.Text":"Cool",
    "Mode.3.Text":"Auto"
}

const PresentValue = {
    "PresentValue.1.Text":"---",
    "PresentValue.2.Text":"Occupied",
    "PresentValue.3.Text":"UnOccupied"
}

export default class EnumData {
    static EquipmentType(value) {          
      return EquipmentType[value];
    }

    static HeatCoolMode(value) {          
        return HeatCoolMode[value];
    }

    static PresentValue(value) {          
        return PresentValue[value];
    }
}