<?php
require_once __DIR__ . '/../../includes/databaseClass.php';
/**
 * Generated by PHPUnit_SkeletonGenerator on 2012-10-22 at 21:23:25.
 */
class databaseTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var database
     */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        $this->object = new database;
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {

    }

    /**
     * @covers database::execSQL
     * @todo   Implement testExecSQL().
     */
    public function testExecSQL()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

    /**
     * @covers database::returnResult
     * @todo   Implement testReturnResult().
     */
    public function testReturnResult()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

}
