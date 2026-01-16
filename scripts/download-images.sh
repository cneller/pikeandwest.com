#!/bin/bash
# Download all images from Webflow CDN for Pike & West Hugo migration
# Run from project root: ./scripts/download-images.sh

set -e

ASSETS_DIR="assets/images"

echo "Creating image directories..."
mkdir -p "$ASSETS_DIR"/{logo,hero,venue,icons,about,social}

echo ""
echo "Downloading logo files..."
curl -sS -o "$ASSETS_DIR/logo/pike-west-logo-horizontal.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552ad8f5fd152ac685e9f1e_P%26W_Logo_H_BlkGold.png"
curl -sS -o "$ASSETS_DIR/logo/pike-west-logomark.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6549ab48e7cf511712e3b62d_P%26W_Logomark_Vanilla_100x100.png"

echo "Downloading hero image..."
curl -sS -o "$ASSETS_DIR/hero/venue-exterior.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654c10539f4e9bf77d741785_PW_Heading_Update3.jpg"

echo "Downloading venue gallery images (10 total)..."
curl -sS -o "$ASSETS_DIR/venue/venue-01-interior.jpeg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/653940d02f5e0d55986035ee_IMG_9427.jpeg"
curl -sS -o "$ASSETS_DIR/venue/venue-02-foyer.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/65b2d684983bc048f14e1aab_BabyShower_Foyer.png"
curl -sS -o "$ASSETS_DIR/venue/venue-03-lower-patio.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/655253cc4ab0af260d3aa1c5_Lower_Patio.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-04-wedding.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654d53e5690c5da32ec5ed23_C35A6707.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-05-dancefloor.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552539a392cb9f529f6a030_Dancefloor_Edit.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-06-soft-seating.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654be2712578acb1b09d5ef0_PW_SoftSeating_666x500px.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-07-bar.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552a82449220c2fc05cac13_Bar_setup_sign.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-08-disco-background.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654d00595f0bb2ab065985ee_PW_Disco_Background.jpg"
curl -sS -o "$ASSETS_DIR/venue/venue-09-table-chairs.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/65b2d8d4aa57182ac057d433_BabyShower_TableChair.png"
curl -sS -o "$ASSETS_DIR/venue/venue-10-seating-area.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/65b2d72afcbee272191ce00e_BabyShower_SoftSeating.png"

echo "Downloading event type icons (6 total)..."
curl -sS -o "$ASSETS_DIR/icons/icon-wedding-rings.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552812baa22400118e9d90b_P%26W_Icon_Rings_Light2.png"
curl -sS -o "$ASSETS_DIR/icons/icon-champagne.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552812b4d648c15256c7f23_P%26W_Icon_Cheers_Light3.png"
curl -sS -o "$ASSETS_DIR/icons/icon-badge.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552812bf0caaf832842ac5a_P%26W_Icon_Lanyard_Light3.png"
curl -sS -o "$ASSETS_DIR/icons/icon-cake.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552812b6b16680e20aae673_P%26W_Icon_Cake_Light2.png"
curl -sS -o "$ASSETS_DIR/icons/icon-disco-ball.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6552812b14ca8ba60fed775f_P%26W_Icon_Disco_Light3.png"
curl -sS -o "$ASSETS_DIR/icons/icon-rattle.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/655281503efd5e86b3655d78_P%26W_Icon_Rattle_Light3.png"

echo "Downloading about section images..."
curl -sS -o "$ASSETS_DIR/about/team-eden-lyndal.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654bf86a5a5345b6e80b2e9b_Eden_Lyndal.jpg"
curl -sS -o "$ASSETS_DIR/about/event-party-bw.jpg" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/654d05ea1030db33141142b0_Groupshot_2.jpg"

echo "Downloading social icons..."
curl -sS -o "$ASSETS_DIR/social/icon-instagram.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6549bab53c0f09f5a4e42a8a_PW_IG_Circle_Icon_Cream.png"
curl -sS -o "$ASSETS_DIR/social/icon-facebook.png" \
	"https://cdn.prod.website-files.com/65393d47a9c3933524124fcb/6549bab474e347095a1b5124_PW_FB_Circle_Icon_Cream.png"

echo ""
echo "Download complete! Files saved to $ASSETS_DIR/"
echo ""
echo "Summary:"
find "$ASSETS_DIR" -type f | wc -l | xargs echo "  Total files:"
du -sh "$ASSETS_DIR" | cut -f1 | xargs echo "  Total size:"
