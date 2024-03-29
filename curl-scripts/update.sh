API="http://localhost:4741"
URL_PATH="/equipment"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "equipment": {
      "equipmentType": "'"${EQUIPMENT_TYPE}"'",
      "modelName": "'"${MODEL_NAME}"'",
      "modelYear": "'"${MODEL_YEAR}"'",
      "modelNumber": "'"${MODEL_NUMBER}"'",
      "serialNumber": "'"${SERIAL_NUMBER}"'"
    }
  }'

echo