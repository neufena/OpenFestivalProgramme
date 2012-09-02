<?php
date_default_timezone_set('Europe/London');
require_once('config.php');
require_once('includes/programmeClass.php');
$programme = new programme();
$event = $programme->getEvent();
?>
<!DOCTYPE html> 
<html> 
    <head> 
        <title><?php echo $event['name']; ?></title> 
        <meta name="viewport" content="width=device-width, initial-scale=1"> 
        <link rel="stylesheet" href="css/jquery.mobile-1.1.0.min.css" />
        <link rel="stylesheet" href="css/style.css" />
        <script src="js/jquery-1.7.2.min.js"></script>
        <script src="js/jquery.mobile-1.1.1.min.js"></script>
    </head> 
    <body> 

        <div data-role="page" id="home">

            <div data-role="header" >
                <h1><?php echo $event['name']; ?></h1>
                <div id="logoWrap">
                    <img src="images/header700.jpeg" id="logo" alt="" />
                    
                </div>
            </div><!-- /header -->

            <div data-role="content">

                <ul data-role="listview" data-inset="true">
                    <?php
                    foreach ($programme->getStages() as $stage) {
                        echo '<li><a href="#' . $stage['shortname'] . '">' . $stage['name'] . '</a></li>';
                    }
                    ?>
                </ul>
                <ul data-role="listview" data-inset="true">
                    <li><a href="#artists">Artists</a></li>
                </ul>

            </div><!-- /content -->

            <div data-role="footer">
                <h1><?php echo date('jS F Y', $event['eventDate']); ?></h1>
            </div><!-- /footer -->

        </div><!-- /page -->

        <?php
        //Pages for each Stage
        foreach ($programme->getStages() as $stage) {
            echo '<div data-role="page" data-add-back-btn="true" id="' . $stage['shortname'] . '">' . PHP_EOL;

            echo '<div data-role="header">' . PHP_EOL;
            echo '<a href="#" data-rel="back" data-icon="back" >Back</a>' . PHP_EOL;
            echo '<h1>' . $stage['name'] . '</h1>' . PHP_EOL;
            echo '<a href="#home" data-icon="home" >Home</a>' . PHP_EOL;

            echo '</div><!-- /header -->' . PHP_EOL;

            echo '<div data-role="content">' . PHP_EOL;

            echo '<ul data-role="listview" data-inset="true" data-filter="true">' . PHP_EOL;

            foreach ($programme->getActsOnStage($stage['id']) as $act) {
                echo '<li><a href="#';
                if (is_null($act['page'])) {
                    echo $act['shortname'];
                } else {
                    echo $act['page'];
                }
                echo '">' . date('h:ia', strtotime($act['time'])) . ': ' . $act['name'] . '</a></li>' . PHP_EOL;
            }

            echo '</ul>' . PHP_EOL;


            echo '</div><!-- /content -->' . PHP_EOL;

            echo '<div data-role="footer">' . PHP_EOL;
            echo '<a href="#" data-rel="back" data-icon="back" class="ui-btn-left">Back</a>' . PHP_EOL;
            echo '<h1>' . date('jS F Y', $event['eventDate']) . '</h1>' . PHP_EOL;
            echo '</div><!-- /footer -->' . PHP_EOL;



            echo '</div><!-- /page -->' . PHP_EOL;
        }

        //Pages for each Act
        foreach ($programme->getActs() as $act) {
            echo '<div data-role="page" data-add-back-btn="true" id="' . $act['shortname'] . '">' . PHP_EOL;

            echo '<div data-role="header">' . PHP_EOL;
            echo '<a href="#" data-rel="back" data-icon="back" >Back</a>' . PHP_EOL;
            echo '<h1>' . $act['name'] . '</h1>' . PHP_EOL;
            echo '<a href="#home" data-icon="home" >Home</a>' . PHP_EOL;
            echo '</div><!-- /header -->' . PHP_EOL;

            echo '<div data-role="content">' . PHP_EOL;

            echo '<div class="picture"><img src="images/' . $act['image'] . '" alt="' .
            $act['name'] . '" /></div>';
            echo '<div class="description">' . $act['description'];
            if ($act['website'] != '') {
            echo '<p><a href="' . $act['website'] . '">Website</a>';
            }
            echo '</div>';
            if ($act['video'] != '') {
                echo '<div class="video"><a href="http://m.youtube.com/watch?v='.$act['video'].'">';
                echo '<img src="http://img.youtube.com/vi/'.$act['video'].'/0.jpg" alt="'.$act['name'].'" />';
                echo '</a></div>';
            }

            echo '</div><!-- /content -->' . PHP_EOL;

            echo '<div data-role="footer">' . PHP_EOL;
            echo '<a href="#" data-rel="back" data-icon="back" class="ui-btn-left">Back</a>' . PHP_EOL;
            echo '<h1>' . date('jS F Y', $event['eventDate']) . '</h1>' . PHP_EOL;
            echo '</div><!-- /footer -->' . PHP_EOL;



            echo '</div><!-- /page -->' . PHP_EOL;
        }
        ?>

        <!-- Artists Index -->
        <div data-role="page" data-add-back-btn="true" id="artists">

            <div data-role="header">
                <a href="#" data-rel="back" data-icon="back" >Back</a>
                <h1>Artists</h1>
                <a href="#home" data-icon="home" >Home</a>
            </div><!-- /header -->

            <div data-role="content">
                <ul data-role="listview" data-inset="true" data-filter="true">
                    <?php
                    foreach ($programme->getActs() as $act) {
                        echo '<li><a href="#' . $act['shortname'] . '">' . $act['name'] . '</a></li>';
                    }
                    ?>
                </ul>


            </div><!-- /content -->

            <div data-role="footer">
                <a href="#" data-rel="back" data-icon="back" class="ui-btn-left">Back</a>
                <h1><?php echo date('jS F Y', $event['eventDate']); ?></h1>
            </div><!-- /footer -->

        </div><!-- /page -->
    </body>
</html>
