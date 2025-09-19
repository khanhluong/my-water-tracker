import { useState } from "react";
import { Button, Modal, View, Text } from "react-native";

export const ModalSample = () => {
  const [visible, setVisible] = useState(false);

  const toogleModal = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Button title="Show modal" onPress={toogleModal} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1 }}>
          <View
            style={{
              position: "absolute",
              top: 200,
              left: 20,
              right: 20,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text>Modal Content</Text>
            <Button title="Close Modal" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};
