---
layout: post
title: Reading RFID Cards on Linux (in the year 2012)
tags:
  - rfid
  - omnikey
  - linux
  - pcsc
---

A while back [tenderlove][9] [blogged][1] about using Ruby to interact with 
[NFC][2] [tags][3]. Near Field Communication (NFC) grew out of
the Radio Frequency Identification ([RFID][4]) standard and has been used for
contact-less payment with SmartPhones. Although,
NFC tags are not yet widely deployed in the US, as opposed to Japan.
On the other hand, RFID _is_ widely deployed in the US, used in Payment systems,
Asset management, Inventory systems, Product tracking, ID cards,
Transportation tracking and even Passports. RFID is out there,
and in those tags may be interesting information.

Not wanting to simply copy [tenderlove][9] and purchase an NFC starter kit,
I went searching for a consumer grade RFID reader. I ended up purchasing
an [OmniKey 6321 USB][5] reader/writer (ideal for mobile use) and
a couple blank [Mifare Read/Write RFID cards][6] (with 8K EEPROM!).
The next logical step is getting the reader working on Linux.

Unless you have a serial RFID reader (or can setup a USB Serial device
with `udev`), the classic [rfdump][6] program is pretty much useless.
[librfid][7] does not appear to be maintained any longer.
Also, `librfid-tool -S` did not detect the OmniKey USB reader.
Google quickly found many tutorials for using [pcsc-lite][8] to interact with
SmartCard readers to read RFID tags.

## Install pcscd

On Debian:

    # apt-get install pcscd

On Fedora:

    # yum install pcsc-lite

## Install the OmniKey 6321 PC/SC Driver

1. Browser to [www.hidglobal.com/driverDownloads.php?techCat=19&prod_id=274][http://www.hidglobal.com/driverDownloads.php?techCat=19&prod_id=274].
2. Select your Operating System. Choose "Linux" for 32bit or
   "Linux x64" for 64bit.
3. Download the `ifdokrfid_lnx` tar archive file.
4. Extract the `ifdokrfid_lnx` tar archive:

       $ tar xzvf ifdokrfid_lnx*.tar.gz
       $ cd ifdokrfid_lnx*/

5. Install the proprietary PC/SC Driver:

       $ ./install

## Start pcscd

Plugin the OmniKey 6321 USB reader and start `pcscd`:

    # pcscd -a -f -d

Then you should see the following output:

    00000083 pcscdaemon.c:575:main() pcsc-lite 1.7.4 daemon ready.
    00002003 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x1D6B, PID: 0x0001, path: /dev/bus/usb/002/001
    00000196 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x1D6B, PID: 0x0001, path: /dev/bus/usb/002/001
    00000189 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x047D, PID: 0x2043, path: /dev/bus/usb/002/002
    00000174 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x047D, PID: 0x2043, path: /dev/bus/usb/002/002
    00000176 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x1D6B, PID: 0x0001, path: /dev/bus/usb/002/001
    00000180 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x046D, PID: 0xC069, path: /dev/bus/usb/002/003
    00000207 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x1D6B, PID: 0x0001, path: /dev/bus/usb/003/001
    00000184 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x1D6B, PID: 0x0001, path: /dev/bus/usb/003/001
    00000190 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x076B, PID: 0x6321, path: /dev/bus/usb/003/002
    00000081 hotplug_libudev.c:258:get_driver() Looking for a driver for VID: 0x076B, PID: 0x6321, path: /dev/bus/usb/003/002
    00000056 hotplug_libudev.c:309:HPAddDevice() Adding USB device: OMNIKEY 6321
    00000087 readerfactory.c:934:RFInitializeReader() Attempting startup of OMNIKEY 6321 (USB iClass Reader) 00 00 using /usr/lib64/pcsc/drivers/ifdokrfid_lnx_x64-2.10.0.1.bundle/Contents/Linux/ifdokrfid.so
    00000423 readerfactory.c:824:RFBindFunctions() Loading IFD Handler 3.0
    HID HID Global OMNIKEY RFID  X64 v2.10.0.1 
    00304886 readerfactory.c:295:RFAddReader() Using the reader polling thread

To test the reader, briefly place an RFID card near the reader then remove it:

    99999999 eventhandler.c:372:EHStatusHandlerThread() powerState: POWER_STATE_POWERED
    00000030 eventhandler.c:387:EHStatusHandlerThread() Card inserted into OMNIKEY 6321 (USB iClass Reader) 00 01
    00000015 Card ATR: 3B 8F 80 01 80 4F 0C A0 00 00 03 06 03 00 03 00 00 00 00 68 
    00462848 eventhandler.c:446:EHStatusHandlerThread() powerState: POWER_STATE_UNPOWERED
    00305960 eventhandler.c:325:EHStatusHandlerThread() Card Removed From OMNIKEY 6321 (USB iClass Reader) 00 01

[1]: http://tenderlovemaking.com/2009/09/19/ruby-and-rfid-tags/
[2]: http://en.wikipedia.org/wiki/Near_field_communication
[3]: http://www.touchatag.com/
[4]: http://en.wikipedia.org/wiki/Radio-frequency_identification
[5]: http://www.hidglobal.com/prod_detail.php?prod_id=274
[6]: http://www.rfdump.org/
[7]: http://openmrtd.org/projects/librfid/
[8]: http://pcsclite.alioth.debian.org/
[9]: https://twitter.com/#!/tenderlove
