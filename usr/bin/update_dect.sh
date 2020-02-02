#!/bin/sh

# Usage: update_dect [ftp [last|0xabcdefgh]] [-f]



source_file()
{
  [ -f $1 ] && . $1 || echo "$script_name: Fichier $1 manquant"
}

wget_wrap()
{
	local filename=$1

	UPDATE_USERNAME=$(kdb get system/config/update/username) 
	UPDATE_PASSWORD=$(kdb get system/config/update/password)
	UPDATE_MACHINE=$(kdb get system/config/update/server)
	UPDATE_DECT_DIRECTORY=$(kdb get system/config/update/dect_directory)
	MODULE_RFPI=$(kdb get system/runtime/dectm/rfpi)
	MODULE_PROJECT=$(kdb get system/runtime/dectm/idproject)
	MODULE_VERSION=$(kdb get system/runtime/dectm/version)
	HANDSET_IPUI=$(kdb get system/runtime/decth/$(eval echo $HANDSET_NB)/ipui)
	HANDSET_VERSION=$(kdb get system/runtime/decth/$(eval echo $HANDSET_NB)/version)
	HANDSET_HARD=$(kdb get system/runtime/decth/$(eval echo $HANDSET_NB)/idhard)
	UPDATE_STATUS=$(kdb get system/runtime/decth/update_log)

	if [ -x /bin/curl ]; then
	    curl -f --retry 2 --connect-timeout 15 "$PROTOCOL://$UPDATE_USERNAME:$UPDATE_PASSWORD@$UPDATE_MACHINE/$UPDATE_DECT_DIRECTORY/$UPDATE_PROJECT/$filename?GATEWAY_MAC=$MAC&GATEWAY_VER=$VER&MODULE_RFPI=$MODULE_RFPI&MODULE_PROJECT=$MODULE_PROJECT&MODULE_VERSION=$MODULE_VERSION&HANDSET_NB=$HANDSET_NB&HANDSET_IPUI=$HANDSET_IPUI&HANDSET_VERSION=$HANDSET_VERSION&HANDSET_HARD=$HANDSET_HARD&UPDATE_STATUS=$UPDATE_STATUS" -o $filename || rm -f $filename
	else
	    wget -T 15 -t 2 "$PROTOCOL://$UPDATE_USERNAME:$UPDATE_PASSWORD@$UPDATE_MACHINE/$UPDATE_DECT_DIRECTORY/$UPDATE_PROJECT/$filename?GATEWAY_MAC=$MAC&GATEWAY_VER=$VER&MODULE_RFPI=$MODULE_RFPI&MODULE_PROJECT=$MODULE_PROJECT&MODULE_VERSION=$MODULE_VERSION&HANDSET_NB=$HANDSET_NB&HANDSET_IPUI=$HANDSET_IPUI&HANDSET_VERSION=$HANDSET_VERSION&HANDSET_HARD=$HANDSET_HARD&UPDATE_STATUS=$UPDATE_STATUS" -O $filename
	fi

	return 0
}

go_ramdisk()
{   
    ramdisk=$(kdb get system/config/update/dect_bin_location)
    if [ ! -d /mnt/ramdisk/rd1/lost+found ]; then
	/etc/init.d/ramdisk start 4
    fi
    mkdir -p $ramdisk
    cd $ramdisk
}


#------------------------------------------------------------------

UPDATE_PROJECT=$2
filename=$3
HANDSET_NB=$4

# Remplissage des variables

MAC=$(kdb get system/redboot/eth_mac)
VER=$(kdb get system/config/version)

case $1 in
	ftp|http|auto)
		PROTOCOL=$1
		;;
esac

update_http()
{
	PROTOCOL=http
	echo "Remote update: $filename"
	go_ramdisk
	wget_wrap $filename
	[ -f $filename ] || exit 1
	wget_wrap $filename.sig
	[ -f $filename.sig ] || exit 1
}

update_usb_key()
{
	MOUNT_DIR="/var/usbmount"
	go_ramdisk
	path=$(find $MOUNT_DIR -name $filename | sed -n 1p)
	[ -f "$path" -a -f "$path.sig" ] || return 1
	rm -f $filename $filename.sig
	cp -f "$path" "$path.sig" .
	return 0
}


# Download du firmware


case $PROTOCOL in
	ftp)
		go_ramdisk
		echo "Download from FTP"
		wget_wrap $filename
		echo "Get $filename"
		;;
	http)
		update_http
		;;
	usb-key)
		update_usb_key
		;;
	auto)
		if [ "$UPDATE_DECT_ON_USB_KEY" = "y" ]; then
			update_usb_key || update_http
		else
			update_http
		fi
		;;
	*)
		if [ "$1" = "stop_ramdisk" ] ; then
		    ramdisk=$(kdb get system/config/update/dect_bin_location)
		    rm -f $ramdisk/*.bin
		    rm -f $ramdisk/*.sig
		    rm -f $ramdisk/*.txt
		    if [ -d /mnt/ramdisk/rd1/lost+found ]; then
			/etc/init.d/ramdisk stop
		    fi
		fi
		;;
esac

