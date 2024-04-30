
 export const getAllRecords1=`
 query MyQuery {
  getAllRecords1 {
    Address
    Name
    Organization
    SerialNumber
  }
}
`

export const getAllRecords2=`
  query MyQuery {
   getAllRecords2 {
    ObjectMap
    Points
   }
 }
`
export const getAllRecords3=`
query MyQuery {
  getAllRecords3 {
    Dimension
    PointMap
    Timestamp
    Unit
    Value
  }
}
`
export const getAllEquipmentsBySerialNumber=`
query MyQuery {
  getAllEquipmentsBySerialNumber {
    items {
      PointMap
      Timestamp
      Unit
      Value
    }
  }
}
`
//(filter: {ObjectMap: {beginsWith: "E08E60850#area" }})
export const getAllEquipmentNamesBySerialNumber=`
query MyQuery {
  getAllEquipmentNamesBySerialNumber {
    items {
      ObjectMap
    }
  }
}
`
 
