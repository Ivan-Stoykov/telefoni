<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Processor;
use App\Models\PhoneSpec;
use App\Models\Phone;
use App\Models\Color;
use App\Models\Brand;
use App\Models\PhoneColor;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'isAdmin' => true,
        ]);

        $proc = Processor::create([
            'brand' => 'Snapdragon',
            'name' => '8 Elite Gen 5',
            'coreCount' => 8,
            'GPU' => 'Adreno 840'
        ]);

        $brand = Brand::firstOrCreate(['name' => 'Samsung']);

        $spec = PhoneSpec::create([
            'processorId' => $proc->id,
            'imageUrl' => 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg',
            'brandId' => $brand->id,
            'MainCamera' => '200 MP (wide), \n 10 MP (telephoto) 3x zoom, \n 50 MP (periscope telephoto) 5x zoom,\n 50 MP (ultrawide)',
            'MCFeatures' => 'Laser AF, Best Face, Horizon Lock, LED flash, auto-HDR, panorama',
            'MCVideo' => '8K@24/30fps, 4K@30/60/120fps, 1080p@30/60/120/240fps, 10-bit HDR, HDR10+, stereo sound rec., gyro-EIS',
            'SelfieCamera' => '12 MP, f/2.2, 23mm (wide), 1/3.2", 1.12µm, dual pixel PDAF',
            'SCFeatures' => 'HDR, HDR10+',
            'SCVideo' => '4K@30/60fps, 1080p@30fps',
            'Wifi' => 'Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, Wi-Fi Direct',
            'Bluetooth' => '6.0, A2DP, LE',
            'Port' => 'USB Type-C 3.2, DisplayPort 1.2, OTG',
            'NFC' => true,
            'Positioning' => 'GPS, GLONASS, BDS, GALILEO, QZSS',
            'Display' => 'Dynamic LTPO AMOLED 2X, 120Hz, HDR10+, 2600 nits (peak)',
            'ScreenSize' => '6.9 inches, 115.9 cm2 (~90.7% screen-to-body ratio)',
            'ScreenResolution' => '1440 x 3120 pixels',
            'ScreenType' => 'Dynamic LTPO AMOLED',
            'Protection' => 'Corning Gorilla Armor 2',
            'Speakers' => 'Stereo speakers',
            'ModelNumber' => 'SM-S948B',
            'Series' => 'S26 Series',
            'Dimensions' => '163.6 x 78.1 x 7.9 mm',
            'Weight' => '214g',
            'OS' => 'Android 16, One UI 8.5',
            'Battery' => 'Li-Ion 5000 mAh',
            'Charging' =>'60W wired, 25W wireless',
            'description' => 'Specific High-End Phone',
        ]);
        
        $phone = Phone::create([
            'PhoneSpecId' => $spec->id,
            'name' => 'Samsung Galaxy S26 Ultra 512GB',
            'slug' => 'Samsung_Galaxy_S26_Ultra_512GB',
            'RAM' => '12GB',
            'Storage' => '512GB',
            'price' => 1649.99,
            ]);
            
            
            $color = Color::firstOrCreate(['color' => 'Black']);
            PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);
            $color = Color::firstOrCreate(['color' => 'White']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);


        $phone = Phone::create([
            'PhoneSpecId' => $spec->id,
            'name' => 'Samsung Galaxy S26 Ultra 1TB',
            'slug' => 'Samsung_Galaxy_S26_Ultra_1TB',
            'RAM' => '16GB',
            'Storage' => '1TB',
            'price' => 1949.99,
            ]);
            
            
            $color = Color::firstOrCreate(['color' => 'Black']);
            PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);
            $color = Color::firstOrCreate(['color' => 'White']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);


        $proc = Processor::create([
            'brand' => 'Apple',
            'name' => 'A19 Pro',
            'coreCount' => 6,
            'GPU' => 'Apple GPU (6-core graphics)'
        ]);
        $brand = Brand::firstOrCreate(['name' => 'Apple']);

        $spec = PhoneSpec::create([
            'processorId' => $proc->id,
            'brandId' => $brand->id,
            'imageUrl' => 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg',
            'MainCamera' => '48 MP (wide), \n 48 MP (periscope telephoto), 4x zoom \n 48 MP (ultrawide)',
            'MCFeatures' => 'Dual-LED dual-tone flash, HDR (photo/panorama)',
            'MCVideo' => '4K@24/25/30/60/100/120fps, 1080p@25/30/60/120/240fps, 10-bit HDR, Dolby Vision HDR (up to 120fps), ProRes, ProRes RAW (up to 120fps), Apple Log 2, 3D (spatial) video/audio, stereo sound rec.',
            'SelfieCamera' => '18MP (ultrawide)',
            'SCFeatures' => 'HDR, Dolby Vision HDR, 3D (spatial) audio, stereo sound rec., ProRes RAW, Apple Log 2',
            'SCVideo' => '	4K@24/25/30/60fps, 1080p@25/30/60/120fps, gyro-EIS',
            'Wifi' => 'Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, hotspot',
            'Bluetooth' => '6.0, A2DP, LE',
            'Port' => 'USB Type-C 3.2 Gen 2, DisplayPort',
            'NFC' => true,
            'Positioning' => 'GPS, GLONASS, GALILEO, BDS, QZSS, NavIC',
            'Display' => 'LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 1600 nits (HBM), 3000 nits (peak)',
            'ScreenSize' => '6.9 inches, 115.6 cm2 (~90.7% screen-to-body ratio)',
            'ScreenResolution' => '1320 x 2868 pixels',
            'ScreenType' => 'LTPO Super Retina XDR OLED',
            'Protection' => 'Ceramic Shield 2',
            'Speakers' => 'Stereo speakers',
            'ModelNumber' => 'A3526',
            'Series' => 'Iphone 17 Series',
            'Dimensions' => '163.4 x 78 x 8.8 mm',
            'Weight' => '233g',
            'OS' => 'iOS 26',
            'Battery' => 'Li-Ion 4823 mAh',
            'Charging' =>'40W wired, 25W wireless',
            'description' => 'Specific High-End Phone',
        ]);
        
        $phone = Phone::create([
            'PhoneSpecId' => $spec->id,
            'name' => 'Apple iPhone 17 Pro Max 512GB',
            'slug' => 'Apple_iPhone_17_Pro_Max_512GB',
            'RAM' => '12GB',
            'Storage' => '512GB',
            'price' => 1699.99
            ]);
            
            $color = Color::firstOrCreate(['color' => 'White']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);
        $color = Color::firstOrCreate(['color' => 'Orange']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);

        $phone = Phone::create([
            'PhoneSpecId' => $spec->id,
            'name' => 'Apple iPhone 17 Pro Max 1TB',
            'slug' => 'Apple_iPhone_17_Pro_Max_1TB',
            'RAM' => '12GB',
            'Storage' => '1TB',
            'price' => 1959.99
            ]);
            
            $color = Color::firstOrCreate(['color' => 'White']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);
        $color = Color::firstOrCreate(['color' => 'Orange']);
            
        PhoneColor::create([
            'phoneId' => $phone->id,
            'colorId' => $color->id,
            'quantity' => 50
        ]);
    }
}
