@empty($records)
    // $records is "empty"...@else // $records is FULL...
                             @endempty
----
@empty($records)
    // $records is "empty"...
@else
    // $records is FULL...
@endempty