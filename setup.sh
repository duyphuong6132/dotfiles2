
# Install yay
git clone https://aur.archlinux.org/yay-bin
cd yay-bin
makepkg -si
cd ~

# Install dependence
yay -S --needed foot alacritty lsd bat tmux neovim tldr vlc yazi ranger \
    fum-bin luarocks luacheck thorium-browser-bin apple-fonts

# Install opensource driver
yay -S --needed mesa vulkan-intel intel-media-driver libva-intel-driver xf86-video-nouveau vulkan-mesa-layers lib32-mesa vulkan-radeon

# Install scripts
git clone --depth=1 https://github.com/JaKooLit/Arch-Hyprland.git ~/Arch-Hyprland 
cd Arch-Hyprland 
chmod +x install.sh
./install.sh
cd ~

# Copy dotfiles
cd dotfiles2
cp -r .config ~/ 
cp .zshrc ~/ 
cp .tmux.conf ~/ 
cp -r .themes ~/ 
cp -r .icons ~/ 
cp -r Pictures ~/ 
