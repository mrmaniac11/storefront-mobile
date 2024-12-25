import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Button, Menu, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { v4 as uuidv4 } from 'uuid';
import { useMenu } from './MenuContext';

interface MenuOption {
  displayName: string;
  callback: () => void;
}

interface MenuBarProps {
  options: MenuOption[];
}

const MenuBar: React.FC<MenuBarProps> = ({ options }) => {
  const { visibleMenu, setVisibleMenu } = useMenu();
  const [menuId] = useState<string>(uuidv4());

  const closeMenu = () => setVisibleMenu(null);
  const openMenu = () => setVisibleMenu(menuId);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Menu
          visible={visibleMenu === menuId}
          onDismiss={closeMenu}
          anchor={
            <Button onPress={openMenu} mode="text" style={styles.menuButton}>
              <Icon name="more-vert" size={20} color="black" />
            </Button>
          }
          style={styles.menuWrapper}
        >
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => {
                option.callback();
                closeMenu();
              }}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <Text style={styles.menuItemText}>{option.displayName}</Text>
            </Pressable>
          ))}
        </Menu>
      </View>
    </PaperProvider>
  );
};

export default MenuBar;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000, // Ensures the menu has the highest priority
    flexDirection: 'row',
    justifyContent: 'center',
    right: 0,
  },
  menuButton: {
    padding: 0,
  },
  // Working
  menuWrapper: {
    elevation: 100, // Ensures the menu has the highest priority on Android
    position: 'absolute',
    left: '-300%',
    top: '75%',
  },
  menuItem: {
    width: '115%',
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
    paddingVertical: 0
  },
  menuItemPressed: {
    backgroundColor: 'lightgray',
  },
  menuItemText: {
    color: 'white',
  },
});
