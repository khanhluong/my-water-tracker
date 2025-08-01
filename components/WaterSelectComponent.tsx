import { Picker as SelectPicker } from '@react-native-picker/picker';
import { useState } from "react";

export const WaterSelectComponent = () => {
  const [selectedValue, setSelectedValue] = useState('default_value');

  return <>
    <SelectPicker
      selectedValue={selectedValue}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      <SelectPicker.Item label="Option 1" value="value1" />
      <SelectPicker.Item label="Option 2" value="value2" />
      <SelectPicker.Item label="Option 3" value="value3" />
    </SelectPicker>
  </>
}